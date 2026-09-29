(function(){
  var CONTACT_EMAIL = 'stembeginshere@gmail.com';

  // --- mobile nav ---
  var burger = document.getElementById('burger');
  var links = document.getElementById('navlinks');
  if(burger && links){
    burger.addEventListener('click', function(){
      var open = links.classList.toggle('show');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function(e){
      if(e.target.tagName === 'A') links.classList.remove('show');
    });
  }

  // --- FAQ accordion (any .faq list on the page) ---
  document.querySelectorAll('.faq .q').forEach(function(q){
    var btn = q.querySelector('button');
    var a = q.querySelector('.a');
    btn.addEventListener('click', function(){
      var open = q.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : 0;
    });
  });

  // --- reveal on scroll ---
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.rv').forEach(function(el, i){
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
      io.observe(el);
    });
  } else {
    document.querySelectorAll('.rv').forEach(function(el){ el.classList.add('in'); });
  }

  // --- hero LED chase (home page only) ---
  var leds = Array.prototype.slice.call(document.querySelectorAll('#leds .led'));
  if(leds.length){
    var i = 0;
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      setInterval(function(){
        leds.forEach(function(l){ l.classList.remove('on'); });
        leds[i].classList.add('on');
        leds[(i+1) % leds.length].classList.add('on');
        i = (i+1) % leds.length;
      }, 420);
    } else {
      leds.forEach(function(l){ l.classList.add('on'); });
    }
  }

  // --- keep anchor jumps clear of the sticky header ---
  function sizeBar(){
    var navH = document.querySelector('header.nav').offsetHeight || 68;
    document.documentElement.style.scrollPaddingTop = (navH + 14) + 'px';
  }
  sizeBar();
  window.addEventListener('resize', sizeBar);
  window.addEventListener('load', sizeBar);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(sizeBar);

  // --- forms ---
  // Submissions go to Web3Forms (https://web3forms.com), which emails each one to
  // the address the access key was created for. The key is meant to be public:
  // it can only send mail to that one address. If it's ever emptied, forms fall
  // back to opening a pre-filled email to CONTACT_EMAIL so nothing is lost.
  var WEB3FORMS_KEY = '36644dbb-cce3-48dc-9b83-2ec294662d37';

  function showNote(note, color, text){
    note.style.display = 'block';
    note.style.color = color;
    note.textContent = text;
  }

  document.querySelectorAll('form[data-subject]').forEach(function(form){
    var note = form.querySelector('.form-note');
    var button = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!form.checkValidity()){
        showNote(note, 'var(--coral)', form.getAttribute('data-invalid') || 'Please fill in the required fields.');
        var bad = form.querySelector(':invalid');
        if(bad) bad.focus();
        return;
      }

      // Collect fields in page order, keyed by their visible label; checkbox
      // groups are joined with commas.
      var fields = {}, lines = [], seen = {};
      Array.prototype.forEach.call(form.elements, function(el){
        if(!el.name || seen[el.name] || el.type === 'submit') return;
        seen[el.name] = true;
        var label = el.getAttribute('data-label') || el.name;
        var value;
        if(el.type === 'checkbox'){
          value = Array.prototype.map.call(form.querySelectorAll('input[name="' + el.name + '"]:checked'),
            function(c){ return c.value; }).join(', ');
          var group = el.closest('fieldset');
          if(group) label = group.getAttribute('data-label') || label;
        } else {
          value = el.value.trim();
        }
        if(value){ fields[label] = value; lines.push(label + ': ' + value); }
      });

      var nameField = form.querySelector('[name="name"]');
      var emailField = form.querySelector('[name="email"]');
      var subject = form.getAttribute('data-subject') + (nameField && nameField.value ? ' from ' + nameField.value.trim() : '');

      if(!WEB3FORMS_KEY){
        window.location.href = 'mailto:' + CONTACT_EMAIL +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(lines.join('\n\n'));
        showNote(note, 'var(--lime)', 'Your email app should open with this message ready to send. A person reads every one.');
        return;
      }

      // Web3Forms uses subject/from_name for the email header, and replies go to
      // the "email" field, so hitting Reply answers the person who wrote in.
      var payload = Object.assign({
        access_key: WEB3FORMS_KEY,
        subject: subject,
        from_name: 'STEMBeginsHere website',
        Form: form.getAttribute('data-subject')
      }, fields);
      if(emailField && emailField.value) payload.email = emailField.value.trim();

      if(button){ button.disabled = true; button.dataset.label = button.textContent; button.textContent = 'Sending…'; }
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function(res){
        return res.json().then(function(data){
          if(!res.ok || !data.success) throw new Error(data.message || ('HTTP ' + res.status));
        });
      }).then(function(){
        form.reset();
        showNote(note, 'var(--lime)', form.getAttribute('data-thanks') ||
          'Thanks! Your message is on its way. A person reads every one and replies within a few days.');
      }).catch(function(){
        showNote(note, 'var(--coral)', 'Sorry, that didn’t go through. Please try again, or email us at ' + CONTACT_EMAIL + '.');
      }).then(function(){
        if(button){ button.disabled = false; button.textContent = button.dataset.label; }
      });
    });
  });

  // --- donate: frequency + amount picker ---
  var picker = document.getElementById('amounts');
  if(picker){
    var custom = document.getElementById('customAmt');
    var impact = document.getElementById('impact');
    var giveBtn = document.getElementById('giveBtn');
    var freq = 'one-time';
    var amount = 100;

    // Keep in sync with the tiers table on donate.html.
    function describe(n){
      if(!n || n < 1) return 'Pick an amount to see what it covers.';
      if(n >= 1500) return '<b>$' + n + '</b> can fund an entire two-day workshop at a school.';
      if(n >= 250)  return '<b>$' + n + '</b> can equip a new student club with a starter set of kits.';
      if(n >= 100)  return '<b>$' + n + '</b> can put hardware kits in the hands of two students.';
      if(n >= 50)   return '<b>$' + n + '</b> can put a full hardware kit in one student’s hands.';
      if(n >= 25)   return '<b>$' + n + '</b> can cover a sensor pack for one student project.';
      return '<b>$' + n + '</b> helps cover wires, resistors, and the parts that wear out.';
    }
    function render(){
      picker.querySelectorAll('button').forEach(function(b){
        b.setAttribute('aria-pressed', (+b.getAttribute('data-amt') === amount && !custom.value) ? 'true' : 'false');
      });
      impact.innerHTML = describe(amount) + (freq === 'monthly' && amount ? ' Every month.' : '');
      giveBtn.textContent = amount ? 'Give $' + amount + (freq === 'monthly' ? ' monthly' : '') + ' on Zeffy →' : 'Give on Zeffy →';
    }
    picker.addEventListener('click', function(e){
      var b = e.target.closest('button');
      if(!b) return;
      custom.value = '';
      amount = +b.getAttribute('data-amt');
      render();
    });
    custom.addEventListener('input', function(){
      amount = Math.floor(+custom.value) || 0;
      render();
    });
    document.querySelectorAll('#freq button').forEach(function(b){
      b.addEventListener('click', function(){
        freq = b.getAttribute('data-freq');
        document.querySelectorAll('#freq button').forEach(function(x){
          x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
        });
        render();
      });
    });
    giveBtn.addEventListener('click', function(){
      // Paste the public link of the Zeffy donation form here (Zeffy > Campaigns >
      // View, then copy the address bar). Until it's set, this emails a pledge.
      var ZEFFY_URL = 'https://www.zeffy.com/en-US/donation-form/fund-the-free-hardware-bootcamp';
      if(ZEFFY_URL){ window.open(ZEFFY_URL, '_blank', 'noopener'); return; }
      var body = 'I would like to give $' + amount + ' (' + freq + ') to STEMBeginsHere. Please send me instructions.';
      window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('Donation pledge') +
        '&body=' + encodeURIComponent(body);
    });
    render();
  }
  // --- press page: copy boilerplate ---
  document.querySelectorAll('[data-copy]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var text = document.getElementById(btn.getAttribute('data-copy')).textContent;
      function done(){ btn.textContent = 'Copied'; setTimeout(function(){ btn.textContent = 'Copy'; }, 1600); }
      if(navigator.clipboard){ navigator.clipboard.writeText(text).then(done, function(){ btn.textContent = 'Select & copy'; }); }
    });
  });
})();
