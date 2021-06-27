// define a new type 
interface obj_dictionary {
    [key: string]: any;
}

// list of quizs and each has an image as a clue
let gallery: obj_dictionary = {
    HAPPY: IconNames.Happy,
    HOUSE: IconNames.House,
    GHOST: IconNames.Ghost,
    DIAMOND: IconNames.Diamond,
    TSHIRT: IconNames.TShirt,
    RABBIT: IconNames.Rabbit,
    ANGRY: IconNames.Angry,
    GIRAFFE: IconNames.Giraffe
}

// randomly choose a quiz
function og_Q() {
    let listKeys = Object.keys(gallery)
    let numK = listKeys.length
    let rand_Q = Math.randomRange(0, numK - 1)
    return listKeys[rand_Q]
}

function To_binary(num: number) {
    let bin = ''
    let mod: number
    while (num > 0) {
        mod = num % 2
        bin = mod + bin
        num = Math.floor(num / 2)
    }
    return bin
}

function BitMask(quiz: string) {
    let bit_max = Math.pow(2, len) - 1
    let bit_min = Math.pow(2, len - 1)
    let bit_rand = Math.randomRange(bit_min, bit_max - 1)
    let bit = To_binary(bit_rand)
    return bit
}

function ofc(Mask: string) {
    // generate the puzzle
    let ofc_Q = ''
    for (let i = 0; i < len; i++) {
        if (Mask[i] === '1') {
            ofc_Q += Quiz[i]
        } else {
            ofc_Q += '_'
            answer.push(characterToMorse(Quiz[i]))
        }
    }
    return ofc_Q
}

function characterToMorse(char: string) {
    let index = char.charCodeAt(0)
    return morseArray[index - 65]
}

function showPuzzle() {
    basic.showIcon(gallery[Quiz])
    basic.clearScreen()
    basic.showString(puzzle)
}

function enterCode() {
    // count the amount of time user hold pin to determine
    // if it's a dot or a dash
    let holding = 0
    let waiting = 0
    let duration = 0
    waiting = input.runningTime()
    while (input.pinIsPressed(TouchPin.P0)) {
        holding = input.runningTime()
    }
    duration = holding - waiting
    if (duration < dot) {
        basic.showLeds(`
                . . . . .
                . . . . .
                . . # . .
                . . . . .
                . . . . .
                `)
        userInput += '.'
    } else {
        if (duration < dash) {
            basic.showString('-')
            userInput += '_'
        }
    }
    basic.clearScreen()

    return holding
}

function CheckAnswer() {
    // initialize user input is not in the answer
    let included = -1
    // start to find user input in the answer
    included = answer.indexOf(userInput, 0)
    if (included > -1) {
        basic.showIcon(IconNames.Yes)
        answer.splice(included, 1)
    } else {
        basic.showIcon(IconNames.No)
    }
    basic.clearScreen()
}

// submit user input (1 letter at a time)
function onSubmit() {
    CheckAnswer()
    userInput = ''
    // if they have solved the puzzle, moving to the next one
    if (answer.length === 1) {
        basic.showIcon(IconNames.Heart) // to congrats 
        basic.clearScreen()
        Score += 1
        solved = true
    }
}

function onPending(stopPress: number) {
    let pending = 0
    let waiting = 0
    do {
        waiting = input.runningTime()
        pending = waiting - stopPress
    }
    while (!input.pinIsPressed(TouchPin.P0) && pending < 1500)
    if (!input.pinIsPressed(TouchPin.P0) && userInput.length > 0) {
        onSubmit()
    }
}

// ****** DECLARATION *****/
let solved = true // pretend the puzzle is solved before the game start
let userInput = ''
let dot = 200
let dash = dot * 3
let answer = ['']
let morseArray = ["._", "_...", "_._.", "_..", ".", ".._.", "__.", "....", "..", ".___", "_._", "._..", "__", "_.", "___", '.__.', "__._",
    "._.", "...", "_", ".._", "..._", ".__", "_.._", "_.__", "__.."]
//******** MAIN PROGRAM ************/
let Quiz = ''
let len = 0
let Mask = ''
let puzzle = ''
let Score = 0

// then only show quiz whenever press button A
input.onButtonPressed(Button.A, function () {
    showPuzzle()
})

// GAME ON
while (Score < 3) {
    // create the puzzle 
    if (solved) {
        Quiz = og_Q()
        len = Quiz.length
        Mask = BitMask(Quiz)
        puzzle = ofc(Mask)
        showPuzzle()
        solved = false
    }
    let stopPress = 0 // the time when user last input code
    basic.pause(50)
    if (input.pinIsPressed(TouchPin.P0)) {
        stopPress = enterCode()
    }
    // automatically submit user input 
    //if they haven't typed anything for 1,5s
    onPending(stopPress)
}
while (Score == 3) {
    basic.showString("YouWin!!!", 80)
}
