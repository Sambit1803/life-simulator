/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');

    // Player state
    let playerState = {
        savedGame: false,
        age: 18,
        daysAdvanced:0,
        remainingDays: 540,
        totalMoney: {
            wallet: 0,
            bank: 0
        },
        dailyExpenses: {
            food: 3
        },
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
        lifestyle: {
            rent: [],
            buy: [],
            items: [],
            food: []
        },
        rent: null,
        food: null
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

    const calcTotalExpense = () => {
        return Object.values(playerState.dailyExpenses).reduce((sum, expense) => sum + expense, 0);
    };

    const calcTotalMoney = () => {
        return Object.values(playerState.totalMoney).reduce((sum, expense) => sum + expense, 0);
    };

    const rentSectionLoad = () => {
        const btn = document.getElementById(playerState.rent);
        if(btn){
            btn.style.display = 'none';
            btn.parentElement.style.color = "green";
        }
    };

    const buySectionLoad = () => {
        playerState.lifestyle.buy.forEach((id) => {
            const btn = document.getElementById(id);
            if(btn){
                btn.style.display = 'none';
                btn.parentElement.style.color = "green";
            }
        });
    };

    const itemsSectionLoad = () => {
        playerState.lifestyle.items.forEach((id) => {
            const btn = document.getElementById(id);
            if(btn){
                btn.style.display = 'none';
                btn.parentElement.style.color = "green";
            }
        });
    };

    const foodSectionLoad = () => {
        const btn = document.getElementById(playerState.food);
        if(btn){
            btn.style.display = 'none';
            btn.parentElement.style.color = "green";
        }
    };

    const tooltipUpdate = () => {
        // Expense tooltip
        const tooltipContainer = document.getElementById('tooltip-expenses');
        tooltipContainer.innerHTML = '';

        for(let key in playerState.dailyExpenses){
            const val = playerState.dailyExpenses[key];
            const node = document.createElement("span");
            const text = document.createTextNode(key+": "+val);
            node.appendChild(text);
            tooltipContainer.appendChild(node);

            const lineBreak = document.createElement("br");
            tooltipContainer.appendChild(lineBreak);
        }

        // Money tooltip
        const tooltipMoneyContainer = document.getElementById('tooltip-money');
        tooltipMoneyContainer.innerHTML = '';

        for(let key in playerState.totalMoney){
            const val = playerState.totalMoney[key];
            const node = document.createElement("span");
            const text = document.createTextNode(key+": "+val);
            node.appendChild(text);
            tooltipMoneyContainer.appendChild(node);

            const lineBreak = document.createElement("br");
            tooltipMoneyContainer.appendChild(lineBreak);
        }
    };

    // Utility functions
    const updateUI = () => {
        document.getElementById('age').textContent = playerState.age;
        document.getElementById('days-advanced').textContent = playerState.daysAdvanced;
        document.getElementById('remaining-days').textContent = playerState.remainingDays;
        document.getElementById('total-money').textContent = calcTotalMoney();
        document.getElementById('daily-expenses').textContent = calcTotalExpense();
        document.getElementById('wallet').textContent = playerState.totalMoney.wallet;

        if(playerState.isInJail){
            showMessage("You are currently in jail!", 'red');
        }

        tooltipUpdate();
        eduTabLoad();
        rentSectionLoad();
        buySectionLoad();
        itemsSectionLoad();
        foodSectionLoad();
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
            playerState.totalMoney.wallet += playerState.jobProfile.salary;
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
            playerState.totalMoney.wallet -= calcTotalExpense();
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

        //money goes negative
        if(calcTotalMoney() <= -1000){
            alert("You got bankrupted! Start a new game")
            localStorage.removeItem('lifeSimulatorData');
            playerState = '';
            location.reload();
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
        playerState.totalMoney.wallet += moneyEarned;
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
            playerState.totalMoney.wallet += 800;
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
        if (!playerState.lifestyle.items.includes('bicycle-button')) {
            alert(`You need to purchase Bicycle from lifestyle tab`);
            return;
        }

        const baseIncome = generateMoney(
            [35, 25, 20, 10, 7, 3],
            [1, 2, 5, 10, 20, 50]
        );
        playerState.totalMoney.wallet += baseIncome * 5;
        advanceDay();
        updateUI();
        showMessage(`You earned ₹${baseIncome * 5} as a delivery guy!`);
    });

    document.getElementById('art-show-button').addEventListener('click', () => {
        if (playerState.isInJail) {
            alert(`You are in jail. You have to skip ${playerState.jailDays} days`);
            return;
        }
        if (!playerState.lifestyle.items.includes('instrument-button')) {
            alert(`You need to purchase instrument from lifestyle tab`);
            return;
        }

        const baseIncome = generateMoney(
            [35, 25, 20, 10, 7, 3],
            [1, 2, 5, 10, 20, 50]
        );
        playerState.totalMoney.wallet += baseIncome * 7;
        advanceDay();
        updateUI();
        showMessage(`You earned ₹${baseIncome * 7} from your art show!`);
    });

    document.getElementById('errands-button').addEventListener('click', () => {
        if (playerState.isInJail) {
            alert(`You are in jail. You have to skip ${playerState.jailDays} days`);
            return;
        }
        if (!playerState.lifestyle.items.includes('bike-button')) {
            alert(`You need to purchase Bike from lifestyle tab`);
            return;
        }

        const baseIncome = generateMoney(
            [35, 25, 20, 10, 7, 3],
            [1, 2, 5, 10, 20, 50]
        );
        playerState.totalMoney.wallet += baseIncome * 10;
        advanceDay();
        updateUI();
        showMessage(`You earned ₹${baseIncome * 10} from doing errands!`);
    });

    // Education tab logic
    document.getElementById('basic-test-button').addEventListener('click', () => {
        if (playerState.totalMoney.wallet >= 1500) {
            playerState.totalMoney.wallet -= 1500;
            playerState.remainingDays += 180; // 6 months
            playerState.education.hasBasicTest = true;
            updateUI();
            alert('You passed the Basic Test!');
        } else {
            alert('Insufficient amount in wallet.');
        }
    });

    document.getElementById('bachelor-degree-button').addEventListener('click', () => {
        if (playerState.education.hasBasicTest) {
            if(playerState.totalMoney.wallet >= 40000) {
                playerState.totalMoney.wallet -= 40000;
                playerState.remainingDays += 1080; // 36 months
                playerState.education.hasBachelorDegree = true;
                updateUI();
                alert('You earned a Bachelor Degree!');
            } else {
                alert('Insufficient amount in wallet.');
            }
        } else {
            alert('You need the Basic Test to get a Bachelor Degree.');
        }
    });

    document.getElementById('masters-degree-button').addEventListener('click', () => {
        if (playerState.education.hasBachelorDegree) {
            if(playerState.totalMoney.wallet >= 60000) {
                playerState.totalMoney.wallet -= 60000;
                playerState.remainingDays += 1440; // 48 months
                playerState.education.hasMastersDegree = true;
                updateUI();
                alert('You earned a Master Degree!');
            } else {
                alert('Insufficient amount in wallet.');
            }
        } else {
            alert('You need the Bachelor Degree to get a Master Degree.');
        }
    });

    document.getElementById('phd-button').addEventListener('click', () => {
        if (playerState.education.hasMastersDegree) {
            if(playerState.totalMoney.wallet >= 70000) {
                playerState.totalMoney.wallet -= 70000;
                playerState.remainingDays += 1800; // 60 months
                playerState.education.hasPhD = true;
                updateUI();
                alert('You earned a PhD!');
            } else {
                alert('Insufficient amount in wallet.');
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
                        alert(`You are already working in this job.`);
                        return;
                    }

                    playerState.jobProfile.activeJob = true;
                    playerState.jobProfile.salary = income;
                    updateUI();
                    alert(`You have switched to a new career. Earning ₹${income}/day.`);
                } else {
                    alert(`Requirement not met: ${requirement}`);
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

    // Lifestyle Tab Logic
    const lifestyleOptions = {
        // Rent Options
        'pg-button': { months: 3, costPerDay: 100, type: 'rent' },
        'rent-2bhk-button': { months: 6, costPerDay: 150, type: 'rent' },
        'rent-3bhk-button': { months: 12, costPerDay: 250, type: 'rent' },
        // Buy Options
        'buy-2bhk-button': { months: 24, cost: 10000, type: 'buy' },
        'buy-3bhk-button': { months: 36, cost: 20000, type: 'buy' },
        'buy-duplex-button': { months: 48, cost: 40000, type: 'buy' },
        'buy-bungalow-button': { months: 60, cost: 80000, type: 'buy' },
        // Items
        'bicycle-button': { months: 1, cost: 200, type: 'item' },
        'instrument-button': { months: 2, cost: 300, type: 'item' },
        'bike-button': { months: 3, cost: 600, type: 'item' },
        // Food
        'food-basic-button': { months: 3, costPerDay: 5, type: 'food' },
        'food-balanced-button': { months: 6, costPerDay: 25, type: 'food' },
        'food-diet-button': { months: 12, costPerDay: 50, type: 'food' },
        // Health
        'checkup-basic-button': { months: 1, cost: 100, type: 'health' },
        'checkup-full-body-button': { months: 3, cost: 250, type: 'health' }
    };

    document.querySelectorAll('#lifestyle-tab .action-button').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.id;
            if (lifestyleOptions[id]) {
                const { months, cost, costPerDay, type } = lifestyleOptions[id];

                // Handle rent and buy options
                if (type === 'rent') {
                    if (playerState.rent !== id) {
                        // Enable the previously selected button, if any
                        if (playerState.rent) {
                            const btn = document.getElementById(playerState.rent);
                            btn.style.display = 'block';
                            btn.parentElement.style.color = "";
                        }

                        // Update the state and disable the newly selected button
                        playerState.rent = id;

                        playerState.dailyExpenses['rent'] = costPerDay;

                        if(!playerState.lifestyle.rent.includes(id)){
                            playerState.remainingDays += months * 30;
                            playerState.lifestyle.rent.push(id);
                        }

                        updateUI();
                        alert(`You rented a property. Daily expenses increased by ₹${costPerDay}`);
                    }
                } else if (type === 'buy') {
                    if (playerState.totalMoney.wallet >= cost) {
                        playerState.totalMoney.wallet -= cost;
                        playerState.remainingDays += months * 30;
                        playerState.lifestyle.buy.push(id);
                        updateUI();
                        alert(`You bought a property. ₹${cost} deducted.`);
                    } else {
                        alert(`Insufficient funds in wallet. Requires ₹${cost}`);
                    }
                }

                // Handle items
                if (type === 'item') {
                    if (playerState.totalMoney.wallet >= cost) {
                        playerState.totalMoney.wallet -= cost;
                        playerState.remainingDays += months * 30;
                        playerState.lifestyle.items.push(id);
                        updateUI();
                        alert(`You purchased an item. ₹${cost} deducted.`);
                    } else {
                        alert(`Insufficient funds in wallet. Requires ₹${cost}.`);
                    }
                }

                // Handle food options
                if (type === 'food') {
                    if (playerState.food !== id) {
                        // Enable the previously selected button, if any
                        if (playerState.food) {
                            const btn = document.getElementById(playerState.food);
                            btn.style.display = 'block';
                            btn.parentElement.style.color = "";
                        }

                        // Update the state and disable the newly selected button
                        playerState.food = id;

                        playerState.dailyExpenses['food'] = costPerDay;

                        if(!playerState.lifestyle.food.includes(id)){
                            playerState.remainingDays += months * 30;
                            playerState.lifestyle.food.push(id);
                        }

                        updateUI();
                        alert(`You switched to a new food plan. Daily expenses increased by ₹${costPerDay}.`);
                    }
                }

                // Handle health plans
                if (type === 'health') {

                    playerState.totalMoney.wallet -= cost;
                    playerState.remainingDays += months * 30;

                    updateUI();
                    alert(`You took a health check-up which costed ₹${cost}.`);
                }
            }
        });
    });
});
