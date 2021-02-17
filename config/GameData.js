"use strict"

const { Event } = require("../models/Event")

module.exports = {
    playerCount: 3,
    startingMoneyAmount: 1500,
    squares: [
        { group: "go", name: "GO", purchase_value: 200 },
        { group: "Brown", name: "Old Kent Road", purchase_value: 60, house_price: 30 },
        { group: "Brown", name: "Whitechapel Road", purchase_value: 60, house_price: 30 },
        { group: "tax", name: "Income Tax", purchase_value: 200 },
        { group: "station", name: "King's Cross Station", puchase_value: 200 },
        { group: "property", name: "The Angel Islington", purchase_value: 100 },
        { group: "chance", name: "Chance" },
        { group: "property", name: "Euston Road", purchase_value: 100 },
        { group: "property", name: "Pentonville Road", purchase_value: 120 },
        { group: "jail", name: "Jail", purchase_value: 0 },
        { group: "property", name: "Pall Mall", purchase_value: 140 },
        { group: "utility", name: "Electric Company", purchase_value: 150 },
        { group: "property", name: "Whitehall", purchase_value: 140 },
        { group: "property", name: "Northumberland Avenue", purchase_value: 160 },
        { group: "station", name: "Maylebone Station", purchase_value: 200 },
        { group: "property", name: "Bow Street", purchase_value: 180 },
        { group: "communitychest", name: "Community Chest" },
        { group: "property", name: "Marlborough Street", purchase_value: 180 },
        { group: "property", name: "Vine Street", purchase_value: 200 },
        { group: "freeparking", name: "Free Parking" },
        { group: "property", name: "Strand", purchase_value: 220 },
        { group: "chance", name: "Chance" },
        { group: "property", name: "Fleet Street", purchase_value: 220 },
        { group: "property", name: "Trafalgar Square", purchase_value: 240 },
        { group: "station", name: "Fenchurch Station", purchase_value: 200 },
        { group: "property", name: "Leicester Square", purchase_value: 260 },
        { group: "property", name: "Coventry Street", purchase_value: 260 },
        { group: "utility", name: "Water Works", purchase_value: 150 },
        { group: "property", name: "Picadilly", purchase_value: 280 },
        { group: "gotojail", name: "Go to Jail" },
        { group: "property", name: "Regent Street", purchase_value: 300 },
        { group: "property", name: "Oxford Street", purchase_value: 300 },
        { group: "communitychest", name: "Community Chest" },
        { group: "property", name: "Bond Street", purchase_value: 320 },
        { group: "station", name: "Liverpool St. Station", purchase_value: 200 },
        { group: "chance", name: "Chance" },
        { group: "property", name: "Park Lane", purchase_value: 350 },
        { group: "tax", name: "Super Tax", purchase_value: 100 },
        { group: "property", name: "Mayfair", purchase_value: 400 }
    ],
    tokens: [
        { name: "Cannon" },
        { name: "Battleship" },
        { name: "Boot" },
        { name: "Terrier" },
        { name: "Car" },
        { name: "Penguin" },
        { name: "Cat" },
        { name: "Duck" }
    ],
    theme: {
        chanceCardColor: "orange",
    },
    chance: [
        {
            text: "Advance to 'Go'. (Collect $200)",
            action: (player) => { player.moveTo('GO'); },
            usage: 'immediate',
            canBeSold: false
        },
        { 
            text: "Advance to Trafalgar Square, if you pass GO, collect $200.", 
            action: (player) => { player.moveTo('Trafalgar Square') },
            usage: 'immediate',
            canBeSold: false
        },
        
        {
            text: "Advance to nearest utility.  If unowned, you may buy it from the bank.  If owned, throw dice and pay owner a total 10 times the amount thrown.",
            action: (player) => {
                player.moveToNearest('utility', { penalty: function (x) { return x * 10 } });
            },
            usage: 'immediate',
            canBeSold: false
        },
        {
            text: "Advance to nearest station and pay owner twice the rental to which they is otherwise entitled.  If station is unowned, you may buy it from the bank.",
            action: (player) => {
                player.moveToNearest('station', { penalty: function (x) { return x * 2; } })
            },
            usage: 'immediate',
            canBeSold: false
        },
        {
            text: "Bank pays you dividend of $50",
            action: (player) => {
                player.notify(new Event(player, "payDividend", { amount: 50 }))
            },
            usage: 'immediate',
            canBeSold: false
        },
        {
            text: "Get out of Jail Free",
            action: (player) => {
                player.useFreeFromJailCard()
            },
            usage: (player) => {
                return player.isInJail()
            },
            canBeSold: true,
            isFreeFromJailCard: true
        },
        {
            text: "Go back 3 spaces",
            action: (player) => {
                player.move(-3)
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "Go to Jail. Go directly to Jail. Do not pass GO, do not collect £200.",
            action: (player) => {
                player.gotoJailWithoutPassingGo()
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "Make general repairs to your properties.  For each house pay $25. For each hotel pay $100.",
            action: (player) => {
                player.makeRepairs(25,100)
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "Pay poor tax $15",
            action: (player) => {
                player.payTax(15)
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "Take a trip to King's Cross Station. If you pass Go collect $200.",
            action: (player) => {
                player.moveTo("King's Cross Station")
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "Take a walk on the board walk. Advance to Mayfair.",
            action: (player) => {
                player.moveTo("Mayfair")
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "You have been elected Chairman of the Board.  Pay each player $50.",
            action: (player) => {
                player.payEveryone(50)
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "Your building and loan matures. Collect $150.",
            action: (player) => {
                player.notify(new Event(player, "payDividend", { amount: 150 }))
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "You have won a competition. Collect $100.",
            action: (player) => {
                player.notify(new Event(player, "payDividend", { amount: 100 }))
            },
            usage: "immediate",
            canBeSold: false
        },
        { 
            text: "Advance to Pall Mall, if you pass GO, collect $200.", 
            action: (player) => { player.moveTo('Pall Mall') },
            usage: 'immediate',
            canBeSold: false
        }
    ],
    communityChest: [
        {
            text: "Advance to 'Go'. (Collect $200)",
            action: (player) => { player.moveTo('GO'); },
            usage: 'immediate',
            canBeSold: false
        },
        {
            text: "Bank error in your favour. Collect $200.",
            action: (player) => {
                player.notify(new Event(player, "payDividend", { amount: 200 }))
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "Pay doctors fee $50",
            action: (player) => {
                player.withdraw(50)
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "From sale of stock. Collect $50.",
            action: (player) => {
                player.notify(new Event(player, "payDividend", { amount: 50 }))
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "Get out of Jail Free",
            action: (player) => {
                player.useFreeFromJailCard()
            },
            usage: (player) => {
                return player.isInJail()
            },
            canBeSold: true,
            isFreeFromJailCard: true
        },
        {
            text: "Go to Jail. Go directly to Jail. Do not pass GO, do not collect £200.",
            action: (player) => {
                player.gotoJailWithoutPassingGo()
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "Grand Opera Night. Collect $50 from each player.",
            action: (player) => {
                player.notify(new Event(player, "payMe", { amount: 50 }))
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "Holiday Fund matures. Collect $100.",
            action: (player) => {
                player.notify(new Event(player, "payDividend", { amount: 100 }))
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "Income Tax refund. Collect $20.",
            action: (player) => {
                player.notify(new Event(player, "payDividend", { amount: 20 }))
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "It's your birthday. Collect $10 from each player.",
            action: (player) => {
                player.notify(new Event(player, "payMe", { amount: 10 }))
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "Life insurance matures. Collect $100.",
            action: (player) => {
                player.notify(new Event(player, "payDividend", { amount: 100 }))
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "Hospital fees. Pay $50",
            action: (player) => {
                player.withdraw(50)
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "School fees. Pay $50",
            action: (player) => {
                player.withdraw(50)
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "Receive $25 consultancy fee.",
            action: (player) => {
                player.notify(new Event(player, "payDividend", { amount: 25 }))
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "You are assessed for street repairs.  For each house pay $40. For each hotel pay $115.",
            action: (player) => {
                player.makeRepairs(40,115)
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "You have won second prize in a beauty contest. Collect $10.",
            action: (player) => {
                player.notify(new Event(player, "payDividend", { amount: 10 }))
            },
            usage: "immediate",
            canBeSold: false
        },
        {
            text: "You have inherited some money. Collect $100.",
            action: (player) => {
                player.notify(new Event(player, "payDividend", { amount: 100 }))
            },
            usage: "immediate",
            canBeSold: false
        }
    ]
}