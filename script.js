// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Countdown Timer
  function updateCountdown() {
    const releaseDate = new Date('May 26, 2026 00:00:00').getTime();
    const now = new Date().getTime();
    const difference = releaseDate - now;
    
    if (difference <= 0) {
      // Game has been released
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }
    
    // Calculate time units
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    // Update the countdown display
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
  }
  
  // Update the countdown every second
  updateCountdown();
  setInterval(updateCountdown, 1000);
  
  // Trailer Modal
  const modal = document.getElementById('trailer-modal');
  const closeModal = document.getElementById('close-modal');
  const trailerIframe = document.getElementById('trailer-iframe');
  
  // Trailer buttons
  const trailerButton1 = document.getElementById('trailer-button-1');
  const trailerButton2 = document.getElementById('trailer-button-2');
  
  // Trailer video IDs
  const trailer1ID = 'QdBZY2fkU-0';
  const trailer2ID = 'VQRLujxTm3c';
  
  // Open trailer modal
  function openTrailerModal(videoId) {
    trailerIframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
    modal.style.display = 'flex';
  }
  
  // Close trailer modal
  function closeTrailerModal() {
    trailerIframe.src = '';
    modal.style.display = 'none';
  }
  
  // Event listeners for trailer buttons
  trailerButton1.addEventListener('click', function() {
    openTrailerModal(trailer1ID);
  });
  
  trailerButton2.addEventListener('click', function() {
    openTrailerModal(trailer2ID);
  });
  
  // Event listener for close button
  closeModal.addEventListener('click', closeTrailerModal);
  
  // Close modal when clicking outside content
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeTrailerModal();
    }
  });
  
  // Close modal when pressing ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeTrailerModal();
    }
  });
  
  // Calendar Button
  const calendarButton = document.getElementById('add-to-calendar-button');
  const calendarDropdown = document.getElementById('calendar-dropdown');
  
  // Toggle calendar dropdown
  calendarButton.addEventListener('click', function() {
    if (calendarDropdown.style.display === 'block') {
      calendarDropdown.style.display = 'none';
    } else {
      // Create calendar links if they don't exist
      if (calendarDropdown.children.length === 0) {
        createCalendarLinks();
      }
      calendarDropdown.style.display = 'block';
    }
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!calendarDropdown.contains(e.target) && e.target !== calendarButton) {
      calendarDropdown.style.display = 'none';
    }
  });
  
  // Create calendar links
  function createCalendarLinks() {
    // Event details
    const eventTitle = "GTA VI Release";
    const eventDescription = "Grand Theft Auto VI official release date";
    const eventStartDate = "20260526T000000Z";
    const eventEndDate = "20260526T235959Z";
    const eventLocation = "Worldwide";
    
    // Calendar services
    const calendarServices = [
      {
        name: "Google Calendar",
        url: "https://www.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(eventTitle) + "&dates=" + eventStartDate + "/" + eventEndDate + "&details=" + encodeURIComponent(eventDescription) + "&location=" + encodeURIComponent(eventLocation)
      },
      {
        name: "Apple Calendar",
        url: "data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ADTSTART:" + eventStartDate + "%0ADTEND:" + eventEndDate + "%0ASUMMARY:" + eventTitle + "%0ADESCRIPTION:" + eventDescription + "%0ALOCATION:" + eventLocation + "%0AEND:VEVENT%0AEND:VCALENDAR"
      },
      {
        name: "Outlook",
        url: "https://outlook.live.com/calendar/0/deeplink/compose?subject=" + encodeURIComponent(eventTitle) + "&startdt=" + eventStartDate + "&enddt=" + eventEndDate + "&body=" + encodeURIComponent(eventDescription) + "&location=" + encodeURIComponent(eventLocation)
      },
      {
        name: "Yahoo Calendar",
        url: "https://calendar.yahoo.com/?v=60&title=" + encodeURIComponent(eventTitle) + "&st=" + eventStartDate + "&et=" + eventEndDate + "&desc=" + encodeURIComponent(eventDescription) + "&in_loc=" + encodeURIComponent(eventLocation)
      }
    ];
    
    // Create links in dropdown
    calendarServices.forEach(service => {
      const link = document.createElement('a');
      link.href = service.url;
      link.className = 'calendar-link';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.innerHTML = `
        <svg class="calendar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
        </svg>
        ${service.name}
      `;
      calendarDropdown.appendChild(link);
    });
  }
});
