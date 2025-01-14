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

    // Player state
    let playerState = {
        savedGame: false,
        age: 18,
        daysAdvanced:0,
        remainingDays: 540, // 1.5 years in days
        money: 0,
        bankBalance: 0,
        dailyExpenses: 3,
        isInJail: false,
        education: {
            hasBasicTest: false,
            hasBachelorDegree: false,
            hasMastersDegree: false,
            hasPhD: false
        },
        jobProfile: {
            activeJob: false,
            currentJob: null,
            salary: 0
        },
        jobs: {},
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
        const savedData = JSON.parse(localStorage.getItem('lifeSimulatorData'));
        if (savedData != null && !savedData.savedGame) {
            // No saved game, start a new game
            playerState.savedGame = true;
            startScreen.style.display = 'none';
            gameScreen.style.display = 'block';
            saveGame();
            updateUI();
        } else if(savedData != null && savedData.savedGame){
            // Prompt user if a saved game already exists
            if (confirm("You have a saved game. Do you still want to start a new game?")) {
                playerState.savedGame = true; // Start a new game
                startScreen.style.display = 'none';
                gameScreen.style.display = 'block';
                saveGame();
                updateUI();
            }
        } else {
                playerState.savedGame = true; // Start a new game
                startScreen.style.display = 'none';
                gameScreen.style.display = 'block';
                saveGame();
                updateUI();
        }
    });

    document.getElementById('continue-game').addEventListener('click', () => {
        loadGame();
        if(!playerState.savedGame) {
            alert("You have no games saved. Start a new game!");
            return;
        }
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
    });

    document.getElementById('reset-game').addEventListener('click', () => {
        if(confirm("Do you want to reset the game?")){
            resetGame();
        }
    });

    document.getElementById('back-to-menu').addEventListener('click', () => {
        location.reload();
    });

    const eduTabLoad = () => {
        // Check if the basic test has been purchased
        if (playerState.education.hasBasicTest) {
            const btn = document.getElementById('basic-test-button');
            btn.style.display = 'none';
            btn.parentElement.style.color = "green";
        }
        if (playerState.education.hasBachelorDegree) {
            const btn = document.getElementById('bachelor-degree-button');
            btn.style.display = 'none';
            btn.parentElement.style.color = "green";
        }
        if (playerState.education.hasMastersDegree) {
            const btn = document.getElementById('masters-degree-button');
            btn.style.display = 'none';
            btn.parentElement.style.color = "green";
        }
        if (playerState.education.hasPhD) {
            const btn = document.getElementById('phd-button');
            btn.style.display = 'none';
            btn.parentElement.style.color = "green";
        }
    };

    // Utility functions
    const updateUI = () => {
        document.getElementById('age').textContent = playerState.age;
        document.getElementById('days-advanced').textContent = playerState.daysAdvanced;
        document.getElementById('remaining-days').textContent = playerState.remainingDays;
        document.getElementById('money').textContent = playerState.money;
        document.getElementById('bank-balance').textContent = playerState.bankBalance;
        document.getElementById('daily-expenses').textContent = playerState.dailyExpenses;

        if(playerState.isInJail){
            showMessage("You are currently in jail!", 'red');
        }

        eduTabLoad();
        saveGame();
    };

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

    // Function to display a temporary message
    const showMessage = (message, color = 'green') => {
        const messageDiv = document.getElementById('action-message');
        messageDiv.textContent = message;
        messageDiv.style.color = color;
        messageDiv.style.visibility = 'visible';
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

    const advanceDay = () => {
        playerState.remainingDays -= 1; // Decrease remaining days
        playerState.daysAdvanced += 1;  // Increment the total days advanced

        // Job money earned
        if (playerState.jobProfile.currentJob && !playerState.isInJail){
            playerState.money += playerState.jobProfile.salary;
            if (!playerState.jobs[playerState.jobProfile.currentJob]) {
                playerState.jobs[playerState.jobProfile.currentJob] = 0;
            }
            playerState.jobs[playerState.jobProfile.currentJob] += 1;
        }

        if (playerState.isInJail) {
            if (--playerState.jailDays <= 0) {
                playerState.isInJail = false;
                alert(`Jail period is over`)
            }
        } else {
            playerState.money -= playerState.dailyExpenses;
        }

        // Calculate new age (assuming 365 days in a year)
        if(playerState.daysAdvanced % 365 === 0){
            playerState.age++;
            playerState.daysAdvanced = 0;
        }

        // Optional: Warning msg
        if (playerState.remainingDays <= 60 && playerState.remainingDays % 10 === 0) {
            alert("Warning! You only have ${playerState.remainingDays} days. Add more months.");
        }

        // Optional: Add logic if remaining days hit zero
        if (playerState.remainingDays <= 0) {
            alert("Game over! Your character's life has ended.");
        }

        updateUI();
    };

    // Home tab logic
    document.getElementById('skip-day').addEventListener('click', () => {
        advanceDay();
        updateUI();
        showMessage(`Day skipped!`);
    });

    document.getElementById('beggar-button').addEventListener('click', () => {
        if (playerState.isInJail) {
            alert(`You are in jail. You have to skip ${playerState.jailDays} days`);
            return;
        }

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
        if (playerState.isInJail) {
            alert(`You are in jail. You have to skip ${playerState.jailDays} days`);
            return;
        }

        const jailChance = Math.random() * 100;
        if (jailChance <= 40) {
            playerState.isInJail = true;
            playerState.jailDays = 30;
            alert("You got caught and are now in jail for 30 days!");
        } else if (jailChance > 40 && jailChance <= 80){
            showMessage("No luck!", "red");
            advanceDay();
        } else {
            playerState.money += 800;
            showMessage(`You successfully stole ₹800!`);
            advanceDay();
        }
        updateUI();
    });

    document.getElementById('delivery-button').addEventListener('click', () => {
        if (playerState.isInJail) {
            alert(`You are in jail. You have to skip ${playerState.jailDays} days`);
            return;
        }
        if (!playerState.hasBicycle) {
            alert(`You need to purchase Bicycle from lifestyle tab`);
            return;
        }

        const baseIncome = generateMoney(
            [35, 25, 20, 10, 7, 3],
            [1, 2, 5, 10, 20, 50]
        );
        playerState.money += baseIncome * 5;
        advanceDay();
        updateUI();
        showMessage(`You earned ₹${baseIncome * 5} as a delivery guy!`);
    });

    document.getElementById('art-show-button').addEventListener('click', () => {
        if (playerState.isInJail) {
            alert(`You are in jail. You have to skip ${playerState.jailDays} days`);
            return;
        }
        if (!playerState.hasInstrument) {
            alert(`You need to purchase instrument from lifestyle tab`);
            return;
        }

        const baseIncome = generateMoney(
            [35, 25, 20, 10, 7, 3],
            [1, 2, 5, 10, 20, 50]
        );
        playerState.money += baseIncome * 7;
        advanceDay();
        updateUI();
        showMessage(`You earned ₹${baseIncome * 7} from your art show!`);
    });

    document.getElementById('errands-button').addEventListener('click', () => {
        if (playerState.isInJail) {
            alert(`You are in jail. You have to skip ${playerState.jailDays} days`);
            return;
        }
        if (!playerState.hasBike) {
            alert(`You need to purchase Bike from lifestyle tab`);
            return;
        }

        const baseIncome = generateMoney(
            [35, 25, 20, 10, 7, 3],
            [1, 2, 5, 10, 20, 50]
        );
        playerState.money += baseIncome * 10;
        advanceDay();
        updateUI();
        showMessage(`You earned ₹${baseIncome * 10} from doing errands!`);
    });

    // Education tab logic
    document.getElementById('basic-test-button').addEventListener('click', () => {
        if (playerState.money >= 1500) {
            playerState.money -= 1500;
            playerState.remainingDays += 180; // 6 months
            playerState.education.hasBasicTest = true;
            updateUI();
            alert('You passed the Basic Test!');
        } else {
            alert('Not enough money to take the Basic Test.');
        }
    });

    document.getElementById('bachelor-degree-button').addEventListener('click', () => {
        if (playerState.education.hasBasicTest) {
            if(playerState.money >= 40000) {
                playerState.money -= 40000;
                playerState.remainingDays += 1080; // 36 months
                playerState.education.hasBachelorDegree = true;
                updateUI();
                alert('You earned a Bachelor Degree!');
            } else {
                alert('Not enough money to get a Bachelor Degree.');
            }
        } else {
            alert('You need the Basic Test to get a Bachelor Degree.');
        }
    });

    document.getElementById('masters-degree-button').addEventListener('click', () => {
        if (playerState.education.hasBachelorDegree) {
            if(playerState.money >= 60000) {
                playerState.money -= 60000;
                playerState.remainingDays += 1440; // 48 months
                playerState.education.hasMastersDegree = true;
                updateUI();
                alert('You earned a Master Degree!');
            } else {
                alert('Not enough money to get a Master Degree.');
            }
        } else {
            alert('You need the Bachelor Degree to get a Master Degree.');
        }
    });

    document.getElementById('phd-button').addEventListener('click', () => {
        if (playerState.education.hasMastersDegree) {
            if(playerState.money >= 70000) {
                playerState.money -= 70000;
                playerState.remainingDays += 1800; // 60 months
                playerState.education.hasPhD = true;
                updateUI();
                alert('You earned a PhD!');
            } else {
                alert('Not enough money to get a PhD.');
            }
        } else {
            alert('You need the Master Degree to get a PhD.');
        }
    });

    // Career Tab Logic
    const careerOptions = {
        'dev-l1-button': { income: 800, requirement: 'Bachelor Degree' },
        'teacher-primary-button': { income: 700, requirement: 'Bachelor Degree' },
        'dev-l2-button': { income: 1500, requirement: 'Software Developer L1 for 12 months' },
        'teacher-secondary-button': { income: 1400, requirement: 'Primary Teacher for 6 months' },
        'professor-button': { income: 4000, requirement: 'Secondary Teacher for 18 months and PhD' },
        'specialist-dev-button': { income: 2000, requirement: 'Software Developer L2 for 24 months' },
        'team-lead-button': { income: 3500, requirement: 'Specialist Developer for 36 months' },
        'manager-button': { income: 5000, requirement: 'Team Lead for 36 months and Masters Degree' },
        'entrepreneur-button': { income: 8000, requirement: 'Manager or Professor for 48 months' },
        'super-entrepreneur-button': { income: 12000, requirement: 'Entrepreneur for 48 months' },
        'investor-button': { income: 20000, requirement: 'Super Entrepreneur for 48 months' }
    };

    document.querySelectorAll('#career-tab .action-button').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.id;
            if (careerOptions[id]) {
                const { income, requirement } = careerOptions[id];

                // Example logic to validate requirements
                if (checkCareerRequirements(id)) {

                    if (playerState.jobProfile.currentJob !== id) {
                        playerState.jobProfile.currentJob = id;

                        // Initialize days spent for this job if it doesn't exist
                        if (!playerState.jobs[id]) {
                            playerState.jobs[id] = 0;
                        }
                    } else {
                        alert(`You are already working in this job`);
                        return;
                    }

                    playerState.jobProfile.activeJob = true;
                    playerState.jobProfile.salary = income;
                    updateUI();
                    alert(`You have switched to a new career. Earning ₹${income}/day.`);
                } else {
                    alert(`Requirement not met: ${requirement}`, 'error');
                }
            }
        });
    });

    // Helper to validate career requirements (replace with your actual logic)
    function checkCareerRequirements(id) {
        switch(id){
            case 'dev-l1-button': return playerState.education.hasBachelorDegree;
            case 'teacher-primary-button': return playerState.education.hasBachelorDegree;
            case 'dev-l2-button': return playerState.jobs['dev-l1-button']/30 >= 12;
            case 'teacher-secondary-button': return playerState.jobs['teacher-primary-button']/30 >= 6;
            case 'professor-button': return playerState.jobs['teacher-secondary-button']/30 >= 18 && playerState.education.hasPhD;
            case 'specialist-dev-button': return playerState.jobs['dev-l2-button']/30 >= 24;
            case 'team-lead-button': return playerState.jobs['specialist-dev-button']/30 >= 36;
            case 'manager-button': return playerState.jobs['team-lead-button']/30 >= 36 && playerState.education.hasMastersDegree;
            case 'entrepreneur-button': return playerState.jobs['manager-button']/30 >= 48 || playerState.jobs['professor-button']/30 >= 48;
            case 'super-entrepreneur-button': return playerState.jobs['entrepreneur-button']/30 >= 48;
            case 'investor-button': return playerState.jobs['super-entrepreneur-button']/30 >= 48;
        }

    }


    // and Lifestyle tab logic can be implemented similarly...
});


