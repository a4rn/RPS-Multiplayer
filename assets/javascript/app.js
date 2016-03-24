
$(function() { 


  var myDataRef = new Firebase("https://reynicolas.firebaseio.com/");
  // var myDataRef = new Firebase("https://reynicolas.firebaseio.com/");

  // Link to Specific subset of database for tracking users ******** (CRITICAL)
  var connectedData = new Firebase("https://reynicolas.firebaseio.com/viewers"); 

  // Link to userData ******** (CRITICAL)
  var userData = connectedData.push(); 

  // Set Initial Counter 
  var currentPlayer = 0;
  var wins = 0;
  var loses = 0;
  var playername;
  var turn;
  // var choice;
  var rpsimg1;
  var rpsImg2;
  var rpsImg3;
  var prevturn=0;
  var ctr1=0;
  localStorage.removeItem('playerno');

  // Add ourselves to presence list when online. ******** 
  var presenceRef = new Firebase("https://reynicolas.firebaseio.com/.info/connected");
    
  presenceRef.on("value", function(snapshot) {
    if (snapshot.val()) {
        // Remove ourselves when we disconnect.
        console.log('presence val = ' + snapshot.val());
        userData.onDisconnect().remove();
        myDataRef.onDisconnect().remove(); 
        userData.set(true);
        console.log('may inalis');
    }
  });

  myDataRef.once('value', function(snapshot) {
    
    var p1exists = snapshot.child('players').child('1').exists()
    var p2exists = snapshot.child('players').child('2').exists()        
    
    if (!p1exists) {
      $('#player1').html('<p>Waiting for Player 1</p>')
      console.log('pasok once p1 wala');
    }
    if (!p2exists) {
      $('#player2').html('<p>Waiting for Player 2</p>')
      console.log('pasok once p2 wala');
    }
  });


  // Number of online users is the number of objects in the presence list. ********
  connectedData.on("value", function(snapshot) {
      
    console.log("# of online users = " + snapshot.numChildren());

  // If any errors are experienced, log them to console. 
    },  function (errorObject) {
          console.log("The read failed: " + errorObject.code)
        }  
  );

 function checkWinner(player1pick,player2pick) {
   
    var player1wins;
    if ((player1pick == 'rock') && (player2pick == 'scissor')){
        player1wins = true; 
    }else if ((player1pick == 'rock') && (player2pick == 'paper')){
        player1wins = false;
    }else if ((player1pick == 'scissor') && (player2pick == 'rock')){
        player1wins = false;
    }else if ((player1pick == 'scissor') && (player2pick == 'paper')){
        player1wins = true; 
    }else if ((player1pick == 'paper') && (player2pick == 'rock')){
        player1wins = true; 
    }else if ((player1pick == 'paper') && (player2pick == 'scissor')){
        player1wins = false;
    }else if (player1pick == player2pick){
        player1wins = null;
    }  
    return (player1wins);

  };


  function checkTurns(snapshot) {
    var cacheplayer = localStorage.getItem('playerno')
    console.log('cacheplayer = ' + cacheplayer)
    turn = snapshot.child('players').child('turn').val();
    
    switch (turn) {

      case 1:
            
            var playername = snapshot.val().players[1].name;
            var wins = snapshot.val().players[1].wins;
            var loses = snapshot.val().players[1].loses;
            if (cacheplayer == 1) { 
            
              buildRpsImg();  
              $('#player1').empty();
              $('#player1').html('<p>' + playername + '</p>');
              $('#player1').append(rpsImg1);
              $('#player1').append(rpsImg2);
              $('#player1').append(rpsImg3);
              $('#player1').append('<h5> Wins: ' + wins + ' Losses: ' + loses + '</h5>');
              $('#player1').css('border','3px solid yellow');
              $('#player1').focus();
            } else {
                $('#player1').empty();
                $('#player1').html('<p>' + playername + '</p>');
                $('#player1').append('<h5> Wins: ' + wins + ' Losses: ' + loses + '</h5>');
                $('#player1').css('border','3px solid red');
            
              }
            break;

      case 2:
            
            var playername = snapshot.val().players[2].name;
            var wins = snapshot.val().players[2].wins;
            var loses = snapshot.val().players[2].loses;
            if (cacheplayer == 2) { 
            
              buildRpsImg();  
              $('#player2').empty();
              $('#player2').html('<p>' + playername + '</p>');
              $('#player2').append(rpsImg1);
              $('#player2').append(rpsImg2);
              $('#player2').append(rpsImg3);
              $('#player2').append('<h5> Wins: ' + wins + ' Losses: ' + loses + '</h5>');
              $('#player2').css('border','3px solid yellow');
              $('#player2').focus();
            } else {
                $('#player2').empty();
                $('#player2').html('<p>' + playername + '</p>');
                $('#player2').append('<h5> Wins: ' + wins + ' Losses: ' + loses + '</h5>');
                $('#player2').css('border','3px solid red');
              }
            break;

    } // end switch
  }


  function checkPlayer(snapshot) {
    var playernum = localStorage.getItem('playerno')
    switch (playernum) {
      case '1':
          
          var playername = snapshot.val().players[1].name;
          var wins = snapshot.val().players[1].wins;
          var loses = snapshot.val().players[1].loses;
       
          $('#player1').html('<p>' + playername + '</p>');
          $('#player1').append('<h5> Wins: ' + wins + ' Losses: ' + loses + '</h5>')

          if (snapshot.child('players').child('2').exists()) {
          
              var playername = snapshot.val().players[2].name;
              var wins = snapshot.val().players[2].wins;
              var loses = snapshot.val().players[2].loses;
              $('#player2').html('<p>' + playername + '</p>');
              $('#player2').append('<h5> Wins: ' + wins + ' Losses: ' + loses + '</h5>')      
          }
          break;

      case '2':
          
          var playername = snapshot.val().players[2].name;
          var wins = snapshot.val().players[2].wins;
          var loses = snapshot.val().players[2].loses;
          $('#player2').html('<p>' + playername + '</p>');
          $('#player2').append('<h5> Wins: ' + wins + ' Losses: ' + loses + '</h5>')

          if (snapshot.child('players').child('1').exists()) {
          
              var playername = snapshot.val().players[1].name;
              var wins = snapshot.val().players[1].wins;
              var loses = snapshot.val().players[1].loses;
              $('#player1').html('<p>' + playername + '</p>');
              $('#player1').append('<h5> Wins: ' + wins + ' Losses: ' + loses + '</h5>')      
          }
          break;
      default:
          
          if (snapshot.child('players').child('1').exists()) {
              var playername = snapshot.val().players[1].name;
              var wins = snapshot.val().players[1].wins;
              var loses = snapshot.val().players[1].loses;
 
              $('#player1').html('<p>' + playername + '</p>');
              $('#player1').append('<h5> Wins: ' + wins + ' Losses: ' + loses + '</h5>')      
              currentPlayer = 1;
          
          } else if (snapshot.child('players').child('2').exists()) {
              var playername = snapshot.val().players[2].name;
              var wins = snapshot.val().players[2].wins;
              var loses = snapshot.val().players[2].loses;
              
               $('#player2').html('<p>' + playername + '</p>');
              
               $('#player2').append('<h5> Wins: ' + wins + ' Losses: ' + loses + '</h5>')
              currentPlayer = 0;
            }
     }
  };

 
  // function showWinner(result) {


  // }

   
  myDataRef.on("child_changed", function(childSnapshot) {
    var turn1 = childSnapshot.val().turn;
    
    if (turn1 !==undefined) {
        if (prevturn !== turn1) {
      
            prevturn=turn1;
            ctr1++;
            console.log('turn = ' + turn1);              
        }
    }
    
  });


  myDataRef.on('value', function(snapshot) {

    if (snapshot.child('players').child('1').exists() &&
        snapshot.child('players').child('2').exists()) {
        
        if (snapshot.child('players').child('1').child('choice').exists() &&
            snapshot.child('players').child('2').child('choice').exists()) {   
            var player1pick = snapshot.val().players[1].choice;
            var player2pick = snapshot.val().players[2].choice;

   
            console.log('player1pick = ' + player1pick + '   player2pick = ' + player2pick)
          
            if (ctr1 >= 2) {
              ctr1=0;
              var result=checkWinner(player1pick,player2pick);
              savePlayerScores(snapshot,result);

              // showWinner(result);
            }
        } else {
   
            checkPlayer(snapshot);
            checkTurns(snapshot);   
          }
        
    }else if (snapshot.child('players').child('1').exists() ||
              snapshot.child('players').child('2').exists()) {       
   
              checkPlayer(snapshot);
          
     }
  });

   
  function buildRpsImg() {

    rpsImg1 = $('<img>'); 
    rpsImg1.attr('src', 'assets/images/rock.jpg');
    rpsImg1.attr('id','rock');
    rpsImg1.attr('data-name','rock');
    rpsImg1.addClass('choice');
    rpsImg2 = $('<img>'); 
    rpsImg2.attr('src', 'assets/images/paper.jpg');
    rpsImg2.attr('id','paper');
    rpsImg2.attr('data-name','paper');
    rpsImg2.addClass('choice');
    rpsImg3 = $('<img>'); 
    rpsImg3.attr('src', 'assets/images/scissor.jpg');
    rpsImg3.attr('id','scissor');
    rpsImg3.attr('data-name','scissor');
    rpsImg3.addClass('choice');  
  
  } // end function

  
  function updatePlayerData(player) {
    console.log(' update PlayerData ');
    var newdata = myDataRef.child('players');
    if (currentPlayer === 1) {
        newdata.update ( {'1' : 
                          {'name' : player, 'loses': 0, 'wins' : 0 }
                        })
        newdata.update ( {'turn' : 2})

    } else if (currentPlayer === 2) {
        newdata.update  ( {'2' : 
                          {'name' : player, 'loses': 0, 'wins' : 0 }
                        })
        newdata.update ( {'turn' : 1})
      }
      
  
  } // eof

  function savePlayerChoice(choice) {
  console.log(' save PlayerChoice');
    var newdata = myDataRef.child('players');
    if (turn === 1) {
        var newchild = newdata.child('1');
        newchild.update ({'choice' : choice })                       
                        
        newdata.update ({'turn' : 2})
       
    } else if (turn === 2) {
        var newchild = newdata.child('2');
        newchild.update ({'choice' : choice })                       
        
        newdata.update ({'turn' : 1})
      }
  } // eof


  function savePlayerScores(snapshot, result) {
    var player1wins=result;
    var newdata = myDataRef.child('players');
        
    if (player1wins!==null) {
      if (player1wins) {
          var playername = snapshot.val().players[1].name;
          var loses = snapshot.val().players[1].loses;
          var wins = snapshot.val().players[1].wins;
          wins++
          var choice = snapshot.val().players[1].choice;
          newdata.update ( {'1' : 
                    {'name' : playername, 'loses': loses, 'wins' : wins, 'choice' : choice }
                    
          })
          newdata.update ( {'turn' : 2})
          $('#board').html('<p>' + playername + ' Wins!</p>')

          console.log('na update 1')
          var playername = snapshot.val().players[2].name;
          var wins = snapshot.val().players[2].wins;
          var loses = snapshot.val().players[2].loses;
          loses++
          var choice = snapshot.val().players[2].choice;
          newdata.update  ( {'2' : 
                       {'name' : playername, 'loses': loses, 'wins' : wins, 'choice' : choice }
                   })
          newdata.update ( {'turn' : 1})        
          console.log('na update 2')

      } else {
          var playername = snapshot.val().players[1].name;
          var loses = snapshot.val().players[1].loses;
          loses++
          var wins = snapshot.val().players[1].wins;
          var choice = snapshot.val().players[1].choice;
             
          newdata.update ( {'1' : 
                    {'name' : playername, 'loses': loses, 'wins' : wins, 'choice' : choice }
                    
          })
          newdata.update ( {'turn' : 2})

          var playername = snapshot.val().players[2].name;
          var loses = snapshot.val().players[2].loses;
          var wins = snapshot.val().players[2].wins;
          wins++;
          var choice = snapshot.val().players[2].choice;

          newdata.update  ( {'2' : 
                       {'name' : playername, 'loses': loses, 'wins' : wins, 'choice' : choice }
                   })
          newdata.update ( {'turn' : 1})        
          $('#board').html('<p>' + playername + ' Wins!</p>')
          
          // setTimeout()
        }
    }
  } // eof



  function savePlayerData(player) {
    console.log('pasok savePlayerData ');

    if (currentPlayer === 1) {
        
        myDataRef.set ( {'players' : 
                          { '1' : {'name': player, 'loses' : 0, 'wins': 0 } } 
                      })  

    }  
  }


  $(document).on('click', '#addPlayerBtn', function() {
    var player = $('#player-name').val().trim();
    if (player.length !== 0) {
       if (currentPlayer === 0) {
          currentPlayer = 1
          savePlayerData(player);
          localStorage.setItem('playerno', 1);           
          $('#player-name').hide();
          $('#addPlayerBtn').hide();                
          $('.addPlayer').html('<p>Hi ' + player + '! You are Player 1</p>');

        } else if (currentPlayer === 1) {

            currentPlayer = 2
            updatePlayerData(player);
            localStorage.setItem('playerno', 2);           
            $('#player-name').hide();
            $('#addPlayerBtn').hide();                
            $('.addPlayer').html('<p>Hi ' + player + '! You are Player 2</p>');
            $('#player2').html('<p>' + player + '</p>');
            $('#player2').append('<h5> Wins: 0 Losses: 0 </h5>')                 
          }
    
    }else { alert("Please enter a name.") }
   
    return false;

  }); // end of addplayer



  $(document).on('click', '.choice', function() {
    var choice = $(this).attr('data-name');
    console.log(choice);

    if (choice=='rock') {
      $('#paper').hide();
      $('#scissor').hide();
    } else if (choice=='paper') {
      $('#rock').hide();
      $('#scissor').hide();
    } else if (choice=='scissor') {
      $('#rock').hide();
      $('#paper').hide();
    }
    
    savePlayerChoice(choice);

    return false;    
  });


}); // end of ready()