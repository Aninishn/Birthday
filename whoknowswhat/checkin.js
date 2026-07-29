(function(){
  const content = document.getElementById('checkinContent');
  const card = document.getElementById('checkinCard');
  const guestId = new URLSearchParams(window.location.search).get('guest');

  // dress the card up with a couple of reusable decorations
  card.appendChild(Scrapbook.tape({ rotate: -6, tone: 'silver' }));
  card.querySelector('.deco-tape').style.position = 'absolute';
  card.querySelector('.deco-tape').style.top = '-14px';
  card.querySelector('.deco-tape').style.left = 'calc(50% - 45px)';

  function statusBadge(rsvp){
    const map = { Accepted: 'accepted', Declined: 'declined', Pending: 'pending' };
    const cls = map[rsvp] || 'pending';
    return `<span class="checkin-status checkin-status--${cls}">${rsvp || 'Pending'}</span>`;
  }

  function render(guest){
    const guestsCount = guest.Guests || 1;
    const alreadyIn = String(guest.CheckedIn).toUpperCase() === 'TRUE';

    content.innerHTML = `
      <p class="checkin-card__name">${guest.Name || 'Guest'}</p>
      <div class="checkin-row"><span class="checkin-row__label">RSVP</span><span class="checkin-row__value">${statusBadge(guest.RSVP)}</span></div>
      <div class="checkin-row"><span class="checkin-row__label">Party size</span><span class="checkin-row__value">${guestsCount}</span></div>
      <button class="checkin-button" id="checkinBtn" ${alreadyIn ? 'disabled' : ''}>
        ${alreadyIn ? 'Already checked in' : 'Check In'}
      </button>
      ${alreadyIn ? `<p class="checkin-message">checked in at ${guest.CheckedInTime || ''} ♡</p>` : ''}
    `;

    const btn = document.getElementById('checkinBtn');
    if (btn && !alreadyIn){
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        btn.textContent = 'Checking in…';
        try {
          const updated = await ScrapbookAPI.checkIn(guestId);
          render(updated);
        } catch (err){
          btn.disabled = false;
          btn.textContent = 'Check In';
          const errNote = document.createElement('p');
          errNote.className = 'checkin-message';
          errNote.textContent = "couldn't reach the guest list — try again";
          content.appendChild(errNote);
        }
      });
    }
  }

  async function init(){
    if (!guestId){
      content.innerHTML = '<p class="checkin-error">no guest code found in this link</p>';
      return;
    }
    try {
      const guest = await ScrapbookAPI.getGuest(guestId);
      if (!guest || guest.error){
        content.innerHTML = `<p class="checkin-error">${(guest && guest.error) || 'guest not found'}</p>`;
        return;
      }
      render(guest);
    } catch (err){
      content.innerHTML = `<p class="checkin-error">${err.message}</p>`;
    }
  }

  init();
})();
