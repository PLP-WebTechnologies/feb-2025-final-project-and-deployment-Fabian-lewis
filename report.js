// Sample data - In a the real application, this will come from a backend API
let globalFundraiserData = {};

// Fetch data from JSON file
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // console.log("Data loaded successfully");
    // console.log(data);  // Shows the array of contributors

    fundraiserData(data);
    
  })
  .catch(error => console.error('Error loading JSON:', error));

  function fundraiserData(data){
    const totalRaised = data.reduce((sum, contributor) => sum + parseFloat(contributor.amount), 0);
    const totalParticipants = data.length;
    const targetAmount = 4700000;
    const individualTargetAmount = 15000;
    const topContributors =data.filter(contributor => parseFloat(contributor.amount) >= individualTargetAmount);
 
    // Assign to global variable
    globalFundraiserData = {
      totalRaised,
      totalParticipants,
      targetAmount,
      topContributors,
      participants: data
    };
    


 
    // Call functions that depend on this data
    updateHTML();
    startContributorRotation();

 }

// Frontend smooth transitions
document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const closeButton = document.querySelector('.close-menu-btn');

    menuButton.addEventListener('click', () => {
      navLinks.classList.add('active');
    });

    closeButton.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('active');
        closeButton.style.display = 'none';
      }
    });
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  
});

// Animate the values
function animateCount(id,start,end,prefix = '', duration = 3000) {
  const element = document.getElementById(id);
  const range = end - start;
  const startTime = performance.now();

  function step(currentTime){
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const current = Math.floor(progress * range + start);
    element.textContent = `${prefix}${current.toLocaleString()}`;
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}


// Update HTML
function updateHTML(){
  // Animate the values
  animateCount('totalRaised', 0, globalFundraiserData.totalRaised, 'KES ', 2000);
  animateCount('targetAmount', 0, globalFundraiserData.targetAmount, 'KES ', 2000);
  animateCount('totalParticipants', 0, globalFundraiserData.totalParticipants, '', 2000);
  // document.getElementById('totalRaised').textContent = `KES ${globalFundraiserData.totalRaised.toLocaleString()}`;
  // document.getElementById('targetAmount').textContent = `KES ${globalFundraiserData.targetAmount.toLocaleString()}`;
  // document.getElementById('totalParticipants').textContent = globalFundraiserData.totalParticipants;
}
// Format currency in Kenyan Shillings
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0
  }).format(amount);
}

// Display top contributors with animationlet 
let currentStartIndex = 0;
let rotatingContributors = [];

function displayTopContributors() {
  const contributorsGrid = document.getElementById('contributorsGrid');
  contributorsGrid.innerHTML = ''; // Clear existing cards

  const maxDisplayed = 4;

  // Slice the current group of contributors
  const currentBatch = rotatingContributors.slice(currentStartIndex, currentStartIndex + maxDisplayed);

  // If we’re near the end and less than 5 remain, wrap around
  if (currentBatch.length < maxDisplayed) {
    const remaining = maxDisplayed - currentBatch.length;
    currentBatch.push(...rotatingContributors.slice(0, remaining));
  }

  // Display the current batch
  currentBatch.forEach((contributor, index) => {
    const card = document.createElement('div');
    card.className = 'contributor-card';
    card.style.animationDelay = `${index + 1 * 5}s`;

    card.innerHTML = `
      <h3>${contributor.name}</h3>
      <p>${formatCurrency(contributor.amount)}</p>
    `;

    contributorsGrid.appendChild(card);

     // Ensure transition starts after a small delay for all cards
    setTimeout(() => {
      const cards = document.querySelectorAll('.contributor-card');
      cards.forEach(card => {
        card.classList.add('show'); // Trigger transition effect
      });
    }, 50); // Overall delay to trigger the transitions
  });

  // Update start index for next rotation
  currentStartIndex = (currentStartIndex + maxDisplayed) % rotatingContributors.length;
}

// Start rotating
function startContributorRotation() {
  rotatingContributors = globalFundraiserData.participants.filter(p => parseFloat(p.amount) >= 15000);

  const contributorsGrid = document.getElementById('contributorsGrid');
  contributorsGrid.innerHTML = '';

  // Immediately show the first batch
  displayTopContributors();

  // Then rotate every 6 seconds (adjust as needed)
  setInterval(displayTopContributors, 5000);
}




// Handle form submission for Google Forms
document.querySelector('form[name="progressForm"]').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default browser redirect
  
  const form = this;

  // Gather form inputs
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();  // Not stored for now
  const scc = document.getElementById('scc').value.trim();

  // Collect multiple checked associations
  const associations = Array.from(document.querySelectorAll('input[name="association"]:checked'))
                            .map(cb => cb.value);

  // Show a loading message
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.innerText = 'Submitting...';

  // Submit form data natively to Google Forms (in background via hidden iframe)
  form.submit();  // Important: Let the browser do this naturally

  // Simulate delay while Google Form is saving
  setTimeout(() => {
    // Find matching participant
    const participant = globalFundraiserData.participants.find(p =>
      p.name.toLowerCase() === name.toLowerCase()
    );

    if (participant) {
      displayPersonalReport(participant);
      // 🎉 Celebrate with confetti
      confetti({
        particleCount: 200,
        startVelocity: 30,
        spread: 120,
        ticks: 60,
        origin: { y: 0.6 }
      });

      // Add a success message
       // Optional: Show a special message
      document.getElementById('reportDisplay').insertAdjacentHTML('beforeend', `
        <div class="celebration-message">
          🎉 Thank you for your amazing support!
        </div>
      `);

    } else {
      alert("Participant not found.");
    }

    // Hide the form and show the report
    form.style.display = 'none';
    document.getElementById('reportDisplay').style.display = 'block';
  }, 1500); // Delay can be tuned
});




// Display personal report
function displayPersonalReport(participant) {
  const reportDisplay = document.getElementById('reportDisplay');
  
  if (participant) {
    const progressPercentage = (participant.amount / 15000) * 100; // Assuming target is 15,000 per person
    
    reportDisplay.innerHTML = `
      <h3>Your Progress Report</h3>
      <div class="progress-info">
        <p><strong>Name:</strong> ${participant.name}</p>
        <p><strong>Amount Contributed:</strong> ${formatCurrency(participant.amount)}</p>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${progressPercentage}%"></div>
      </div>
      <p class="progress-text">${progressPercentage}% of your target</p>
    `;
  } else {
    reportDisplay.innerHTML = `
      <div class="no-match-message">
        <h3>No Record Found</h3>
        <p>We couldn't find a matching record with the provided information. Please check your details and try again.</p>
      </div>
    `;
  }
  
  reportDisplay.style.display = 'block';
}

// Mobile menu functionality
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const closeMenuBtn = document.querySelector('.close-menu-btn');

menuToggle.addEventListener('click', () => {
  navMenu.classList.add('active');
  closeMenuBtn.style.display = 'block';
});

closeMenuBtn.addEventListener('click', () => {
  navMenu.classList.remove('active');
  closeMenuBtn.style.display = 'none';
}); 