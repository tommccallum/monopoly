"use strict"

module.exports = {
    playerCount: 3,
    startingMoneyAmount: 1500,
    squares: [
        { group: "go", name: "GO", purchase_value: 200 },
        { group: "Brown", name: "Old Kent Road", purchase_value: 60, house_price: 30 },
        { group: "Brown", name: "Whitechapel Road", purchase_value: 60, house_price: 30 },
        { group: "incometax", name: "Income Tax", puchase_value: -200 },
        { group: "station", name: "Kings Cross Station", puchase_value: 200 },
        { group: "property", name: "The Angel Islington", purchase_value: 100 },
        { group: "chance", name: "Chance" },
        { group: "property", name: "Euston Road", purchase_value: 100 },
        { group: "property", name: "Pentonville Road", purchase_value: 120 },
        { group: "jail", name: "Jail", purchase_value: 0 },
        { group: "property", name: "Pall Mall", purchase_value: 140 },
        { group: "utility", name: "Electric Company", purchase_value: 150 },
        { group: "property", name: "Whitehall", purchase_value: 140 },
        { group: "property", name: "Northumberland Avenue", purchase_value: 160 },
        { group: "property", name: "Maylebone Station", purchase_value: 200 },
        { group: "station", name: "Bow Street", purchase_value: 180 },
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
        { group: "tax", name: "Super Tax", purchase_value: -100 },
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
            text: "Advance to Trafalgar Square", 
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
                player.notify(new Event.Event(player, "payDividend", { amount: 50 }))
            },
            usage: 'immediate',
            canBeSold: false
        },
        {
            text: "Get out of Jail Free",
            action: (player) => {
                if (player.isInJail()) {
                    player.freeFromJail()
                }
            },
            usage: (player) => {
                return player.isInJail()
            },
            canBeSold: true
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
                player.tax(15)
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
                player.notify(new Event.Event(player, "bankPayment", { amount: 150 }))
            },
            usage: "immediate",
            canBeSold: false
        }
    ],
    communityCheck: [

    ]
}