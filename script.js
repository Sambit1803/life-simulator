/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const ageConst = document.getElementById('age').textContent;
    const daysAdvancedConst = document.getElementById('days-advanced').textContent;
    const remainingDaysConst = document.getElementById('remaining-days').textContent;
    const moneyConst = document.getElementById('money').textContent;
    const bankBalanceConst = document.getElementById('bank-balance').textContent;
    const dailyExpensesConst = document.getElementById('daily-expenses').textContent;

    // Function to switch tabs
    const switchTab = (tabName) => {
        // Hide all tab contents
        tabContents.forEach((content) => {
            content.style.display = 'none';
        });

        // Deactivate all tab buttons
        tabButtons.forEach((button) => {
            button.classList.remove('active');
        });

        // Show the selected tab content
        document.getElementById(`${tabName}-tab`).style.display = 'block';

        // Highlight the active tab button
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    };

    // Add click event listeners to all tab buttons
    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Initialize by showing the "home" tab by default
    switchTab('home');

    // Player state
    let playerState = {
        age: 18,
        daysAdvanced:0,
        remainingDays: 547, // 1.5 years in days
        money: 0,
        bankBalance: 0,
        dailyExpenses: 3,
        isInJail: false,
        activeJob: null,
    };

    const loadGame = () => {
        const savedData = JSON.parse(localStorage.getItem('lifeSimulatorData'));
        if (savedData) {
            playerState = savedData;
            updateUI();
        }
    };

    const saveGame = () => {
        localStorage.setItem('lifeSimulatorData', JSON.stringify(playerState));
    };

    const resetGame = () => {
        localStorage.removeItem('lifeSimulatorData');
        location.reload();
    };

    document.getElementById('new-game').addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        saveGame();
    });

    document.getElementById('continue-game').addEventListener('click', () => {
        loadGame();
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
    });

    // Function to display a temporary message
    const showMessage = (message, color = 'green') => {
        const messageDiv = document.getElementById('action-message');
        messageDiv.textContent = message;
        messageDiv.style.color = color;
        messageDiv.style.display = 'block';

        // Hide the message after 3 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    };

    // Probability helper function
    const generateMoney = (probabilities, values) => {
        const random = Math.random() * 100;
        let cumulativeProbability = 0;
        for (let i = 0; i < probabilities.length; i++) {
            cumulativeProbability += probabilities[i];
            if (random <= cumulativeProbability) return values[i];
        }
        return 0;
    };

    // Utility functions
    const updateUI = () => {
        document.getElementById('age').textContent = playerState.age;
        document.getElementById('days-advanced').textContent = playerState.daysAdvanced;
        document.getElementById('remaining-days').textContent = playerState.remainingDays;
        document.getElementById('money').textContent = playerState.money;
        document.getElementById('bank-balance').textContent = playerState.bankBalance;
        document.getElementById('daily-expenses').textContent = playerState.dailyExpenses;
        saveGame();
        disableButtons();
    };

    const disableButtons = () => {
        if(playerState.isInJail){
            document.getElementById('beggar-button').disabled = true;
            document.getElementById('thief-button').disabled = true;
            document.getElementById('delivery-button').disabled = true;
            document.getElementById('art-show-button').disabled = true;
            document.getElementById('errands-button').disabled = true;
        } else {
            document.getElementById('beggar-button').disabled = false;
            document.getElementById('thief-button').disabled = false;
        }
    };

    const advanceDay = () => {
        playerState.remainingDays -= 1; // Decrease remaining days
        playerState.daysAdvanced += 1;         // Increment the total days advanced

        if (playerState.isInJail) {
            if (--playerState.jailDays <= 0) {
                playerState.isInJail = false;
            }
        } else {
            playerState.money -= playerState.dailyExpenses;
        }

        // Calculate new age (assuming 365 days in a year)
        if(playerState.daysAdvanced % 365 === 0){
            playerState.age++;
            playerState.daysAdvanced = 0;
        }

        // Optional: Add logic if remaining days hit zero
        if (playerState.remainingDays <= 0) {
            alert("Game over! Your character's life has ended.");
        }
        updateUI();
    };

    // Home tab logic
    document.getElementById('beggar-button').addEventListener('click', () => {
        if (playerState.isInJail) return;

        const moneyEarned = generateMoney(
            [35, 25, 20, 10, 7, 3], // probabilities
            [1, 2, 5, 10, 20, 50]   // values
        );
        playerState.money += moneyEarned;
        advanceDay();
        updateUI();
        showMessage(`You earned ₹${moneyEarned} as a beggar!`);
    });

    document.getElementById('thief-button').addEventListener('click', () => {
        if (playerState.isInJail) return;

        const jailChance = Math.random() * 100;
        if (jailChance <= 40) {
            playerState.isInJail = true;
            playerState.jailDays = 30;
            disableButtons();
            alert("You got caught and are now in jail for 30 days!");
        } else if (jailChance > 40 && jailChance <= 80){
            alert("No luck!");
            advanceDay();
        }else {
            playerState.money += 800;
            alert("You successfully stole ₹800!");
            advanceDay();
        }
        updateUI();
    });

    document.getElementById('delivery-button').addEventListener('click', () => {
        if (playerState.isInJail || !playerState.hasBicycle) return;

        const baseIncome = generateMoney(
            [35, 25, 20, 10, 7, 3],
            [1, 2, 5, 10, 20, 50]
        );
        playerState.money += baseIncome * 5;
        advanceDay();
        updateUI();
        alert(`You earned ₹${baseIncome * 5} as a delivery guy!`);
    });

    document.getElementById('art-show-button').addEventListener('click', () => {
        if (playerState.isInJail || !playerState.hasInstrument) return;

        const baseIncome = generateMoney(
            [35, 25, 20, 10, 7, 3],
            [1, 2, 5, 10, 20, 50]
        );
        playerState.money += baseIncome * 7;
        advanceDay();
        updateUI();
        alert(`You earned ₹${baseIncome * 7} from your art show!`);
    });

    document.getElementById('errands-button').addEventListener('click', () => {
        if (playerState.isInJail || !playerState.hasBike) return;

        const baseIncome = generateMoney(
            [35, 25, 20, 10, 7, 3],
            [1, 2, 5, 10, 20, 50]
        );
        playerState.money += baseIncome * 10;
        advanceDay();
        updateUI();
        alert(`You earned ₹${baseIncome * 10} from doing errands!`);
    });

    document.getElementById('skip-day').addEventListener('click', () => {
        advanceDay();
        updateUI();
    });

    // Education tab logic
    document.getElementById('basic-test-button').addEventListener('click', () => {
        if (playerState.money >= 1500) {
            playerState.money -= 1500;
            playerState.remainingDays += 180; // 6 months
            playerState.hasBasicTest = true;
            document.getElementById('bachelor-degree-button').disabled = false;
            updateUI();
            alert('You passed the Basic Test!');
        } else {
            alert('Not enough money to take the Basic Test.');
        }
    });

    document.getElementById('bachelor-degree-button').addEventListener('click', () => {
        if (playerState.money >= 40000 && playerState.hasBasicTest) {
            playerState.money -= 40000;
            playerState.remainingDays += 1095; // 36 months
            playerState.hasBachelorDegree = true;
            document.getElementById('masters-degree-button').disabled = false;
            document.getElementById('dev-l1-button').disabled = false;
            document.getElementById('teacher-primary-button').disabled = false;
            updateUI();
            alert('You earned a Bachelor Degree!');
        } else {
            alert('You need ₹40,000 and the Basic Test to get a Bachelor Degree.');
        }
    });

    // Similar logic for Masters Degree and PhD
    // Career tab and Lifestyle tab logic can be implemented similarly...
});


