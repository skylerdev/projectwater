const quotes = [
	{ 
		"quote" : "The average canadian uses 329 litres of water every day while the average African family uses only 20 litres."
	},
	{
		"quote" : "Running the tap while brushing your teeth can waste 16 litres of water!"
	},
	{
		"quote" : "From May 1st to October 15th citizens are only allowed to water their lawns on specific days, visit metrovancouver.org to find out more!"
	},
	{
        "quote" : "Newer toilets use as little as a third as much water as older toilets!"
    },
    {
        "quote" : "Fixing a leaky faucet can save over 10 000 litres of water in a year!"
    },
    {
        "quote" : "Low-flow shower heads use as little as half as much water as regular shower heads!"
    },
    {
        "quote" : "Instead of running the tap while washing dishes, fill the sink with soapy water."
    },
    {
        "quote" : "Watering your plant early in the morning can reduce the amount of water needed because a lot less will evaporate"
    }
]


function randomQuote() {
  let random = quotes[Math.floor(Math.random() * quotes.length)];
  quotation.innerText = `${random.quote}`;
}
