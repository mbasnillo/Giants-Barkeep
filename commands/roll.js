module.exports = {
  name: 'roll',
  description: 'Rolls a dice based on given arguments',
  execute(client, cmd, message, args) {
    if (args.length === 0) {
      return message.channel.send('Missing required arguments!');
    }
    
    if (args.length > 0) {
      if (!isNaN(args[0])) {
        // If arg is a number, roll dice with that many faces
        let roll = Math.floor(Math.random() * args[0] + 1);

        return message.channel.send(`Result: ${roll}`);
      } else {
        // Parse message first, currently only accepts flat rolls i.e. 2d6 or 4d20
        let dice = args[0];

        let comment = ''; // = args[1] || null; // TODO: Support multi-word comments
        for (a = 1; a < args.length; a++) {
          comment += `${args[a]} `;
        }
        console.log(comment);
        let addComment = false;

        let qty = dice.substr(0, dice.indexOf('d')) || 1; // defaults to 1 die if no qty is specified

        let arrayNum = dice.match(/\d+/g);
        let arrayEquations = dice.match(/[^0-9.]/g);
        if (!dice.substr(0, dice.indexOf('d'))) arrayNum.splice(0, 0, 1); // If no number at front i.e. d20, add 1 to start of array

        arrayNum.shift();
        arrayEquations.shift();

        let sides = arrayNum.shift();

        const originalRolls = [];
        const results = [];

        for (i = 0; i < qty; i++) {

          let roll = Math.floor(Math.random() * sides + 1);
          originalRolls.push(roll);
  
          for (j = 0; j < arrayEquations.length; j++) {
            let nextNum = parseInt(arrayNum[j]);
            switch(arrayEquations[j]) {
              case '+':
                roll = roll + nextNum;
                break;
              case '-':
                roll = roll - nextNum;
                break;
              case '*':
                roll = roll * nextNum;
                break;
              case '/':
                roll = roll / nextNum;
                break;
              default:
                break;
            }
          }

          results.push(roll);
        }

        const total = results.reduce((a, b) => a + b, 0);

        const resultText = results.length > 1 ? 'Results:' : 'Result:';

        if (comment && comment.startsWith('#')) addComment = true;

        return message.reply(`Original: ${originalRolls} | Final ${resultText} ${results} | Total: ${total} ${addComment ? `| ${comment}` : ''}`);
      }
    }
  }
}

/*
  Hax0r Code; put inside outer for-loop

  if (message.author.username == 'Majeure') {
    results.push(parseInt(sides));
  } else if (message.author.username == 'Ensis') {
    results.push(1);
  } else {
  }
*/