const readline = require('readline');

const readlineInterface = readline.createInterface(process.stdin, process.stdout);



function ask(questionText) {

  return new Promise((resolve, reject) => {

    readlineInterface.question(questionText, resolve);

  });

};

/*Setup code  Player object / class definitions / commands / global functions*****/



const player = {

  currentRoom: null,

  isHungry: true,

  inventory: [],



  showInventory: function () {

    console.log('You are carrying:')

    this.inventory.forEach((item) => {

      console.log(item)

    })

  }

}



class Room {

  constructor(name, desc, inventory) {

    this.name = name

    this.desc = desc

    this.locked = false

    this.inventory = inventory || []



    // room methods

    this.room = () => {

      if (playerAction === unlock) {

        this.room.locked = false

      }

    }



    this.see = () => {

      return (this.desc)

    }



  }

}



class Item {

  constructor(name, description, takeable) {

    this.name = name

    this.description = description

    this.takeable = takeable || false



    // Item methods

    this.examineItem = (item) => {

      return (this.description)

    }



    this.takeItem = (item) => {

      return (this.takeable)

    }



  }

}



// commands

const commands = {

  read: ['read', 'look', 'view', 'decipher', 'examine'],

  exit: ['exit', 'end'],

  unlock: ['unlock', 'enter', 'key', 'punch', 'press'],

  take: ['pick', 'take', 'grab', 'steal', 'buy'],

  drop: ['drop', 'remove', 'leave'],

  enter: ['go', 'open', 'key'],

  consume: ['eat', 'drink',]

}



// Items

const things = {

  paper: ['sevendays', '7Days', 'days', 'newspaper', 'paper']

}



function capitalize(word) {

  let firstLetter = word[0];

  let restOfWord = word.slice(1);

  return firstLetter.toUpperCase() + restOfWord.toLowerCase();

}



function enterRoom(roomTo) {

  let roomNow = player.currentRoom.name

  let validTransitions = roomIn[roomNow].canChangeTo;

  if (validTransitions.includes(roomTo.name)) {

    player.currentRoom = roomTo

    console.log('\nSuccess! The door opens. You enter the foyer and the door shuts behind you.\n')

    console.log(roomTo.desc)

  } else {

    console.log("Invalid state transition attempted - from " + roomNow + " to " + roomTo);

  }

}



function takeItem(item) {

  if (player.inventory.includes(item)) {

    console.log("You already have " + item)

  } else {

    player.inventory.push(item)

    player.currentRoom.inventory.pop(item)

  }

};



function leaveItem(item) {

  player.currentRoom.inventory.push(item)

  player.inventory.pop(item)

}







/******************Objects*********************** */



//Items

const paper = new Item('7 Days', 'It is a 7 Days newspaper, rumpled and torn, from August 2014', true);

const sign = new Item('sign', 'Welcome to Burlington Code Academy! Come on up to the third floor. If the door is locked, use the code 12345.')







//Rooms

const MainSt = new Room('MainSt', 'There is a door here. A keypad sits on the handle. On the door is a handwritten sign.', ['keypad', 'sign']);

MainSt.locked = true

const Foyer = new Room('Foyer', 'You are in a foyer. Or maybe it\'s an antechamber. Or a vestibule. Or an entryway. Or an atrium. Or a narthex. But let\'s forget all that fancy flatlander vocabulary, and just call it a foyer. In Vermont, this is pronounced "FO-ee-yurr". A copy of Seven Days lies in a corner.', ['Sevendays']);

const Hallway = new Room('Hallway', 'You are in a hallway on the 3rd floor.  To your left is an alcove with a Kitchen. In front of you is a door with a window.  You can see tables and chairs through the window', []);

const Classroom = new Room('Classroom', 'Bob is in the classroom drinking tea and waiting to lecture.'['Bob', 'laptop']);

const Kitchen = new Room('Kitchen', 'Tea is brewing in the teapot,'['tea']);

const Muddies = new Room('Muddies', 'Would you like to buy some coffee and a snack? It will make you code faster and with more energy.', ['coffee', 'snacks']);

const MrMikes = new Room('MrMikes', 'Pizza on a Friday is great for networking,'['pizza']);





//State Machine 

let roomIn = {

  'MainSt': { canChangeTo: ['Foyer', 'MrMikes', 'Muddies'] },

  'Foyer': { canChangeTo: ['MainSt', 'Hallway',] },

  'Hallway': { canChangeTo: ['Foyer', 'Kitchen', 'Classroom'] },

  'Classroom': { canChangeto: ['Hallway'] },

  'Kitchen': { canChangeto: ['Hallway'] },

  'Muddies': { canChangeto: ['MainSt', 'MrMikes'] },

  'MrMikes': { canChangeto: ['Muddies', 'MainSt'] },

}



//Lookups

let roomLookup = {

  'MainSt': MainSt,

  'Foyer': Foyer,

  'Hallway': Hallway,

  'Classroom': Classroom,

  'Kitchen': Kitchen,

  'Muddies': Muddies,

  'MrMikes': MrMikes

}



let itemsLookup = {

  'sign': sign,

  'paper': paper



}







/********************* Game process******************************** */



start();



async function start() {

  const instruction = `\nWelcome to a typical day at Burlington code Academy

  Please answer questions as asked.

  

  You may let me know what you want to do by entering:

  a verb and an item.

  (ex. enter room, or take pizza)



  You can check what you have by entering 'i'



  When you are done enter 'exit'.

  

  Are you ready to play?\n(Yes / No)>_`



  const welcomeMessage = `You are at 182 Main St, 

standing between Church St. and South Winooski Ave.



There is a door here. A keypad sits on the handle.

On the door is a handwritten sign.

(press enter to continue)`;



  let response = await ask(instruction);

  if (response.toLowerCase().charAt(0) !== 'y') {

    console.log('Try again.  I do not understand ' + response + '.')

    start();

  } else {

    player.currentRoom = MainSt

    let answer = await ask(welcomeMessage);

    play()

    //process.exit();

  }

}



async function play() {

  let playerInput = await ask('\nWhat do you want to do?"\n>_')

  let cleanInput = playerInput.toLowerCase()

  let inputArray = cleanInput.split(' ');

  let playerAction = inputArray[0];

  let playerItem = inputArray[(inputArray.length - 1)]

  let playerFunction = (playerAction + capitalize(playerItem))



  // end game

  if (commands.exit.includes(playerAction)) {

    process.exit()

  }



  //check player inventory

  else if (cleanInput === 'i') {

    if (player.inventory.length === 0) {

      console.log('You do not have anything yet.')

      play()

    } else {

      player.showInventory()

      play()

    }

  }



  //read item **story added

  else if (commands.read.includes(playerAction)) {

    let item = itemsLookup[playerItem]

    console.log(item.description)

    play()

  }



  //cannot take untakeable sign

  else if (commands.take.includes(playerAction) && playerItem === 'sign') {

    let item = itemsLookup[playerItem]

    item.takeItem(item)

    if (item.takeable === false) {

      console.log('That would be selfish. How will other students find their way?')

      play()

    }

  }



  //cannot enter locked room

  else if (commands.enter.includes(playerAction)) {

    if (player.currentRoom.locked === true) {

      console.log('The door is locked. There is a keypad on the door handle.')

      play()

    }

  }



  //unlock door... or not

  else if (commands.unlock.includes(playerAction)) {

    if (inputArray.includes('12345')) {

      player.currentRoom.locked = false;

      let newRoom = roomLookup['Foyer']

      enterRoom(newRoom)

      console.log()

      play()

    } else {

      console.log('Bzzzzt! The door is still locked.')

      play()

    }

  }



  //drop item

  else if (commands.drop.includes(playerAction) && (things.paper.includes(playerItem))) {

    let item = playerItem

    leaveItem(item)

    console.log('You are leaving the ' + playerItem + ' in the ' + player.currentRoom.name)

    play()

  }



  //take item

  else if (commands.take.includes(playerAction) && (things.paper.includes(playerItem))) {

    let item = playerItem

    takeItem(item)

    console.log('You pick up the paper and leaf through it looking for comics and ignoring the articles, just like everybody else does.')

    play()

  }



  //default for bad input

  else {

    console.log('Sorry, I don\'t know how to ' + playerAction + ' .')

    play()

  }

}