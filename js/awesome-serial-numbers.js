"use strict";

(function () {

	// polyfilled input changer with debouncing for 100 ms
	var timeToAwesomeness;
	$("#serialNumber").on('propertychange input', function (e) {
	    var valueChanged = false;

	    if (e.type=='propertychange') {
	        valueChanged = e.originalEvent.propertyName=='value';
	    } else {
	        valueChanged = true;
	    }
	    if (valueChanged) {
	    	Awesomeify();
	    	// if (timeToAwesomeness) clearTimeout(timeToAwesomeness);
	    	// timeToAwesomeness = setTimeout(Awesomeify, 50);
	    }
	});

	function addWords(url, wordlist) {
		$.get(url, function (data, textStatus, xhr) {
			Array.prototype.push.apply(wordlist, data.split('\n')
			                           .map(function (x) { return x.trim(); })
			                           .filter(function (x) { return x && x.length > 0; }));
			wordlist.sort();
		});
	}

	var adjectives = [];
	[
		'age',
		'algorithms',
		'appearance',
		'character',
		'colors',
		'complexity',
		'construction',
		'corporate_prefixes',
		'emotions',
		'geometry',
		'linguistics',
		'materials',
		'music_theory',
		'physics',
		'quantity',
		'shape',
		'size',
		'sound',
		'speed',
		'temperature',
		'weather',
	].map(function (x) {
		return 'wordlists/adjectives/' + x + '.txt';
	}).forEach(function (url) { 
		addWords(url, adjectives); 
	});

	var nouns = [];
	[
		'3d_graphics',
		'3d_printing',
		'accounting',
		'algorithms',
		'apex_predators',
		'astronomy',
		'automobiles',
		'birds',
		'buildings',
		'cats',
		'cheese',
		'chemistry',
		'coding',
		'condiments',
		'construction',
		'containers',
		'corporate',
		'corporate_job',
		'cotton',
		'data_structures',
		'design',
		'dogs',
		'driving',
		'fast_food',
		'filmmaking',
		'fish',
		'food',
		'fortifications',
		'fruit',
		'furniture',
		'gaming',
		'geography',
		'geometry',
		'ghosts',
		'houses',
		'insurance',
		'linear_algebra',
		'meat',
		'metals',
		'military_airforce',
		'military_army',
		'military_navy',
		'minerals',
		'music_instruments',
		'music_production',
		'music_theory',
		'phones',
		'physics',
		'physics_optics',
		'physics_units',
		'physics_waves',
		'plants',
		'radio',
		'real_estate',
		'seasonings',
		'set_theory',
		'shopping',
		'spirits',
		'sports',
		'startups',
		'storage',
		'travel',
		'typography',
		'vcs',
		'water',
		'web_development',
		'wine',
		'wood',
		'writing',
	].map(function (x) {
		return 'wordlists/nouns/' + x + '.txt';
	}).forEach(function (url) { 
		addWords(url, nouns); 
	});

	// Awesomeify those boring old serial numbers!
	var hash =  new Hashes.MD5();
	function Awesomeify() {
		var boringOldSN = $("#serialNumber").val();
		if (boringOldSN == "") {
			return $("#result").val(wayBetterSN);
		}

		var hexits = hash.hex(boringOldSN);
		var uniformlyBoringSN = parseInt(hexits, 16);

		var nAdj = adjectives.length;
		var nNouns = nouns.length;

		// 256 bits of information => 2^256 possible values
		// var valuesPerSecondAdj= Math.pow(2, hexits.length) / adjectives.length;
		// var valuesPerFirstAdj = valuesPerSecondAdj/ adjectives.length;
		// var leftOvers = valuesPerFirstAdj / nouns.length;
		// console.log('I got ' + nAdj + ' adjectives and ' + nNouns + ' nouns');
		// console.log('I figure I can use the first adjective to split it into groups of ' + valuesPerSecondAdj + ' and the second into ' + valuesPerFirstAdj + ' and finally the noun into groups of ' + leftOvers);
		// console.log('This means I have about ' + leftOvers + ' collisions expected over the whole address space');

		var nounIdx = uniformlyBoringSN % nNouns;
		uniformlyBoringSN /= nNouns;
		var secondAdjIdx = uniformlyBoringSN % nAdj;
		uniformlyBoringSN /= nAdj;
		var firstAdjIdx = uniformlyBoringSN % nAdj;
		uniformlyBoringSN /= nAdj;

		var firstAdj = adjectives[firstAdjIdx];
		var secondAdj = adjectives[secondAdjIdx];
		var noun = nouns[nounIdx];

		var wayBetterSN = [ firstAdj, secondAdj, noun ].join(' ');
		// console.log('I went from this ' + boringOldSN + ' to this ' + wayBetterSN);

		$("#result").val(wayBetterSN);
	}

})();