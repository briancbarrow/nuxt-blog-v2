---
title: Exploring Elm
description:
img: exploring-elm/image.png
alt: Exploring Elm header image
date: 2025-06-29
published: true
---

I've been exploring functional programming languages lately, specifically Elixir, but Elm has been on my radar for a few years. It seems to be one of those languages that people really love once they get into it.

This weekend I decided to take a closer look to see what people like about it.

## Initial Impressions

I started by reading the [Elm Guide](https://guide.elm-lang.org/). This line in particular caught my attention:

> I can safely guarantee that if you give Elm a shot and actually make a project in it, you will end up writing better JavaScript code. The ideas transfer pretty easily!

That seems to be a good reason to explore Elm, even if I don't end up using it professionally.

I initially started my programming career in the JavaScript world. I know that JavaScript gets a lot of flak, but I personally think it's a great language. However, I do recognize the issues that come with it. When TypeScript was first gaining popularity, I was very skeptical and I wasn't convinced that it was necessary. Having now worked with other typed languages like Go, I can definitely see the benefits, and I was happy to see that Elm is a typed language.

Elm seems to have been extremely well thought out, and the type system is no exception.

I also really like the fact that with Elm, you can build applications without worrying about runtime errors. Being confident that your code will run without errors is a really nice feeling. On top of that, the error messages that the language provides are incredibly helpful.

Another thing that caught my attention was the statement in the guide that Elm files typically end up being around 400-1000 lines of code. That took me aback a bit. The guide went on to explain that JS developers often feel uncomfortable with that length because in JavaScript, the longer a file gets, the harder it is to be sure that there aren't any errors that will pop up at runtime. That definitely tracks with my experience.

## Building a Small Project

In order to get a better feel for the language, I knew I wanted to build a small project. I've long been a fan of the Pomodoro technique. However, I find myself skipping break sessions because I end up in a flow state and don't want to break it. I recently came across the idea of the Flowtime technique, which is similar to Pomodoro but allows for longer work sessions without interrupting your flow. I've been using this [Flowmo timer](https://app.flowmo.io) lately and wanted to build my own version of it. I figured this would be a great project to test out Elm.

The biggest hurdle to overcome was wrapping my head around the Model-View-Update architecture that Elm uses. I've used similar patterns in React/Redux, but the full MVU cycle in Elm was a bit of a shift in my thinking.

I based the initial structure of my app on the Time example in the Elm Guide, knowing that I would just need to tweak it to fit a timer rather than a clock.

The model I ended up with was pretty simple:

```elm
type alias Model =
    { time : Float
    , direction : Direction
    , running : Bool
    , lastPosix : Time.Posix
    }
```

_(Side note: I'm not sure how I feel about the leading commas. It feels a bit odd to me, but I've just chalked it up to being an opinion that I have, but hold loosely.)_

The `Direction` type is a simple union type that can be either `CountingUp` or `CountingDown`. The `running` field is a boolean that indicates whether the timer is currently running, and `lastPosix` is used to keep track of the last time the timer was updated.

The update function is where I had to take time to really understand how the MVU cycle works. The idea that the model holds the state of the application, that each update call returns a new model, and that the view is a function of the model is really elegant. It was just something that I had to keep reminding myself of as I was building the app.
I have four types of messages in the update function:

```elm
type Msg
    = Start
    | Stop
    | ToggleDirection
    | Tick Time.Posix
```

The `Start` and `Stop` messages are pretty self-explanatory. They toggle the `running` state of the timer and toggle the direction of the timer if necessary. The `ToggleDirection` message switches the direction of the timer between counting up and counting down. The `Tick` message is used to update the timer based on the elapsed time since the last tick.

The `Tick` message is where the complexity increases. I need to know if the timer is just starting so that I can properly set the `lastPosix` value, and then I need to calculate the new time based on the direction of the timer. If the timer is counting down, I need to make sure that it doesn't go below zero.

When the timer hits zero, I need to stop the timer and toggle the direction so that when the user starts it again, it will count correctly for either the focus or break session. It also plays a sound to indicate that the timer has finished and the break session is done.

```elm
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Start ->
            ( { model | running = True, lastPosix = Time.millisToPosix 0 }, Cmd.none )

        Stop ->
            let
                modelWithNewTime =
                    { model | running = False, time = model.time / 5 }
            in
            update ToggleDirection modelWithNewTime

        ToggleDirection ->
            ( { model
                | direction =
                    case model.direction of
                        CountingDown ->
                            CountingUp

                        CountingUp ->
                            CountingDown
              }
            , Cmd.none
            )

        Tick now ->
            if not model.running then
                ( model, Cmd.none )

            else
                let
                    -- If lastPosix is 0, this is the first tick after starting
                    isFirstTick : Bool
                    isFirstTick =
                        Time.posixToMillis model.lastPosix == 0

                    deltaMilli : Float
                    deltaMilli =
                        if isFirstTick then
                            0

                        else
                            toFloat (Time.posixToMillis now - Time.posixToMillis model.lastPosix)

                    deltaSec : Float
                    deltaSec =
                        deltaMilli / 1000

                    newTime : Float
                    newTime =
                        case model.direction of
                            CountingUp ->
                                model.time + deltaSec

                            CountingDown ->
                                model.time - deltaSec

                    stopCounter : Bool
                    stopCounter =
                        newTime <= 0 && model.direction == CountingDown

                    -- Check if we just crossed zero while counting down
                    justHitZero : Bool
                    justHitZero =
                        stopCounter && model.time > 0
                in
                if justHitZero then
                    let
                        ( newModel, _ ) =
                            update ToggleDirection
                                { model
                                    | time = 0
                                    , lastPosix = now
                                    , running = False
                                }
                    in
                    ( newModel, playSound () )

                else
                    ( { model
                        | time = newTime
                        , lastPosix = now
                        , running = not stopCounter
                      }
                    , Cmd.none
                    )
```

The `playSound` function is a simple port to the `Audio` API that plays a sound when the timer finishes. I know that Ports are a way to communicate between Elm and JavaScript, but they still seem a bit magical to me, and I'll definitely need to spend more time understanding them, specifically how Elm is exposing them to JavaScript.

## Other Thoughts

I found it interesting that there doesn't seem to be a built in way to watch for changes in the project. I fully understand that this might just be a skill issue on my part and that I missed it in the guide/docs. After not finding anything quickly in the guide, I was able to get a shell script from Copilot that worked really well. This is a small thing, but I felt like it was worth noting considering the amount of thought that has gone into other aspects of the developer experience in Elm.

Overall, I enjoyed learning Elm and building this small project. It was good to see how another functional language approaches things, and I can definitely see why people enjoy it.

I definitely have a lot more to learn to understand how it works in a larger application, but it was a good experience to get my feet wet.

Feel free to check out the code for the project on [GitHub](https://github.com/briancbarrow/elm-flowmo) and the working demo on [Github Pages](https://briancbarrow.github.io/elm-flowmo/).
