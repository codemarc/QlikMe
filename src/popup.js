'use strict';

$(window).on('load', function () {

  $('#sdrefresh').on('click', (e) => { localStorage.clear(); chrome.runtime.reload(); });

  Vue.component('card-item', {
    props: ['card'],
    template: `
      <li>
        <a :href="card.url" target="_new">
          {{card.name}}
          <img v-if="card.offsite" src="external-link-icon.png" class="icon"></img>
        </a>
      </li>`
  });

  Vue.component('card', {
    props: ['title', 'content', 'cat'],
    template: `
      <div>
        <div class="uk-card uk-card-default uk-card-body">
          <span v-bind:class="'uk-card-title '+this.cat">{{this.title}}</span>
          <ul class="uk-list">
            <card-item v-for="bookmark in content" :key="bookmark.name" v-bind:card="bookmark"></card-item>
          </ul>
        </div>
      </div>
      `
  });

  new Vue({
    data: {
      name: chrome.runtime.getManifest().name,
      url: chrome.runtime.getManifest().author.firebase.console,
    }, el: '#identity'
  });

  new Vue({
    data: {
      name: chrome.runtime.getManifest().version,
      url:  'https://chrome.google.com/webstore/detail/smash-data-links/cdkaahilodclnbkjdhidkdhpimlhnndh'
    }, el: '#version'
  });

  var lsData = localStorage.getItem('BookMarcs');
  if (lsData != null) {

    new Vue({
      data: function () { return JSON.parse(lsData); },
      el: '#bookmarks'
    });

  } else {

    firebase.initializeApp(chrome.runtime.getManifest().author.firebase.config);
    firebase.database().ref('/').once('value').then(function (snapshot) {
      new Vue({
        data: function () { return (localStorage.setItem('BookMarcs', JSON.stringify(lsData = snapshot.val())), lsData); },
        el: '#bookmarks'
      });
    });

  }

});
