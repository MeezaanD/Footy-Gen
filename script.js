        // Array to store the list of players
        var players = [];
        
        // Function to add a player to the list
        function addPlayer() {
            var playerNameInput = document.getElementById("playerName");
            var playerName = playerNameInput.value;
            
            var playerImageInput = document.getElementById("playerImage");
            var playerImage = playerImageInput.value;
            
            if (playerName !== "") {
                players.push({ name: playerName, image: playerImage });
                var playersList = document.getElementById("playersList");
                var li = document.createElement("li");
                li.appendChild(document.createTextNode(playerName));
                playersList.appendChild(li);
                playerNameInput.value = "";
                playerImageInput.value = "";
                saveDataToLocalStorage();
                renderPlayerImage(playerName, playerImage);
            }
        }
        
        // Function to render the player image
        function renderPlayerImage(playerName, playerImage) {
            var playerImagesDiv = document.getElementById("playerImages");
            var img = document.createElement("img");
            img.src = playerImage;
            img.alt = playerName;
            img.classList.add("player-image");
            playerImagesDiv.appendChild(img);
        }
        
        // Function to randomize the teams
        function randomizeTeams() {
            var team1 = document.getElementById("team1");
            var team2 = document.getElementById("team2");
            team1.innerHTML = "";
            team2.innerHTML = "";
        
            if (players.length < 10) {
                alert("Please add at least 10 players to the list.");
                return;
            }
            
            var randomizedPlayers = shuffleArray(players);
            
            for (var i = 0; i < 10; i++) {
                var li = document.createElement("li");
                li.appendChild(document.createTextNode(randomizedPlayers[i].name));
                
                if (i < 5) {
                    team1.appendChild(li);
                } else {
                    team2.appendChild(li);
                }
            }
        }
        
        // Function to shuffle an array
        function shuffleArray(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;
        
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
        
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
        
            return array;
        }
        
        // Function to save data to localStorage
        function saveDataToLocalStorage() {
            localStorage.setItem("players", JSON.stringify(players));
        }
        
        // Function to load data from localStorage
        function loadDataFromLocalStorage() {
            var storedPlayers = localStorage.getItem("players");
            if (storedPlayers) {
                players = JSON.parse(storedPlayers);
                renderPlayersList();
                renderPlayerImages();
            }
        }
        
        // Function to render the players list from the localStorage
        function renderPlayersList() {
            var playersList = document.getElementById("playersList");
            playersList.innerHTML = "";
        
            for (var i = 0; i < players.length; i++) {
                var playerName = players[i].name;
                var li = document.createElement("li");
                li.appendChild(document.createTextNode(playerName));
                playersList.appendChild(li);
            }
        }
        
        // Function to render the player images from the localStorage
        function renderPlayerImages() {
            var playerImagesDiv = document.getElementById("playerImages");
            playerImagesDiv.innerHTML = "";
        
            for (var i = 0; i < players.length; i++) {
                var playerName = players[i].name;
                var playerImage = players[i].image;
                renderPlayerImage(playerName, playerImage);
            }
        }
        
        // Function to clear localStorage
        function clearLocalStorage() {
            localStorage.removeItem("players");
            players = [];
            renderPlayersList();
            var playerImagesDiv = document.getElementById("playerImages");
            playerImagesDiv.innerHTML = "";
        }
        
        // Load data from localStorage when the page loads
        window.addEventListener("load", function() {
            loadDataFromLocalStorage();
        });