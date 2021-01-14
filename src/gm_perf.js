/**
 * utilise des fonctions trouvées ici 
 */


class Performance {
	// https://github.com/nicjansma/tampermonkey/blob/master/longtasks.js
	static longTaskTiming = function(){
		// only run in top frame
		if (window.self !== window.top) {
			return;
		}

		console.log("LongTasks: Initializing");

		var observer = new window.PerformanceObserver(function(list) {
			var perfEntries = list.getEntries();

			for (var i = 0; i < perfEntries.length; i++) {
				console.log("LongTasks: ",
					perfEntries[i].name,
					perfEntries[i].duration,
					perfEntries[i].attribution.length,
					perfEntries[i].attribution.length > 0 ? perfEntries[i].attribution[0].containerType : null,
					perfEntries[i].attribution.length > 0 ? perfEntries[i].attribution[0].containerName : null,
					perfEntries[i].attribution.length > 0 ? perfEntries[i].attribution[0].containerSrc : null,
					perfEntries[i].attribution.length > 0 ? perfEntries[i].attribution[0].containerId : null,
					perfEntries[i]);
			}
		});

		if (typeof window.PerformanceLongTaskTiming !== "undefined") {
			console.log("LongTasks: Appears to be supported");
		} else {
			console.log("LongTasks: Not supported");
		}

		try {
			observer.observe({ entryTypes: ["longtask"] });
		} catch (e) {
			console.log("LongTasks: Not supported");
		}
	}
	// https://github.com/nicjansma/tampermonkey/blob/master/painttiming.js
	static paintTiming = function(){
		// only run in top frame
		if (window.self !== window.top) {
			return;
		}

		console.log("PaintTiming: Initializing");

		var observer = new window.PerformanceObserver(function(list) {
			var perfEntries = list.getEntries();

			for (var i = 0; i < perfEntries.length; i++) {
				console.log("PaintTiming: ",
					perfEntries[i].name,
					perfEntries[i].startTime);
			}
		});

		if (typeof window.PerformancePaintTiming !== "undefined") {
			console.log("PaintTiming: Appears to be supported");
		} else {
			console.log("PaintTiming: Not supported");
			return;
		}

		try {
			observer.observe({ entryTypes: ["paint"], buffered: true });
		} catch (e) {
			console.log("PaintTiming: Not supported");
		}
	}
	
}
export default Performance;
