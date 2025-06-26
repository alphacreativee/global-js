const sampleData = {
  features: [
    {
      properties: {
        name: "United Kingdom",
        latitude: 55.3781,
        longitude: -3.436,
        pop_max: 67330000,
        region: "uk",
      },
    },
    {
      properties: {
        name: "Spain",
        latitude: 40.4637,
        longitude: -3.7492,
        pop_max: 47360000,
        region: "spain",
      },
    },
    {
      properties: {
        name: "Saudi Arabia",
        latitude: 24.7136,
        longitude: 46.6753,
        pop_max: 34810000,
        region: "ksa",
      },
    },
    {
      properties: {
        name: "USA - Florida",
        latitude: 27.9944,
        longitude: -81.7603,
        pop_max: 21540000,
        region: "usa-florida",
      },
    },
    {
      properties: {
        name: "Vietnam",
        latitude: 14.0583,
        longitude: 108.2772,
        pop_max: 97470000,
        region: "vietnam",
      },
    },
  ],
};

let globe;
let allPlaces = sampleData;

// Function to count regions
function updateRegionCounts(places) {
  const counts = {
    uk: places.features.filter((d) => d.properties.region === "uk").length,
    spain: places.features.filter((d) => d.properties.region === "spain")
      .length,
    ksa: places.features.filter((d) => d.properties.region === "ksa").length,
    "usa-florida": places.features.filter(
      (d) => d.properties.region === "usa-florida"
    ).length,
    vietnam: places.features.filter((d) => d.properties.region === "vietnam")
      .length,
  };

  Object.keys(counts).forEach((region) => {
    const countElement = document.getElementById(`count-${region}`);
    if (countElement) {
      countElement.textContent = `(${counts[region]})`;
    }
  });
}

// Function to move globe to a specific region
function moveToRegion(region) {
  if (!globe) {
    console.error("Globe is not initialized");
    return;
  }

  const regions = allPlaces.features.filter(
    (r) => r.properties.region === region
  );
  console.log("Moving to region:", region, regions);
  if (regions.length === 0) {
    console.warn("No regions found for:", region);
    return;
  }

  const { latitude: lat, longitude: lng } = regions[0].properties;
  console.log("Moving to coordinates:", { lat, lng, altitude: 2.5 });

  globe.pointOfView({ lat, lng, altitude: 2.5 }, 2000); // 2-second transition
}

// Function to reset view to global view
function resetView() {
  if (!globe) {
    console.error("Globe is not initialized");
    return;
  }

  // Uncheck all checkboxes
  const regions = [
    "filter-uk",
    "filter-spain",
    "filter-ksa",
    "filter-usa-florida",
    "filter-vietnam",
  ];
  regions.forEach((id) => {
    document.getElementById(id).checked = false;
  });

  // Reset to global view
  globe.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 2000);
}

// Function to handle checkbox changes
function handleRegionChange(regionId, region) {
  const checkbox = document.getElementById(regionId);

  if (checkbox.checked) {
    // Uncheck other checkboxes (single selection)
    const allRegions = [
      "filter-uk",
      "filter-spain",
      "filter-ksa",
      "filter-usa-florida",
      "filter-vietnam",
    ];
    allRegions.forEach((id) => {
      if (id !== regionId) {
        document.getElementById(id).checked = false;
      }
    });

    // Move to selected region
    moveToRegion(region);
  } else {
    // If unchecked, reset to global view
    resetView();
  }
}

// Initialize globe
function initGlobe(places) {
  console.log("Initializing Globe with Places:", places.features);
  const globeContainer = document.getElementById("globeViz");
  console.log("Globe Container Size:", globeContainer.getBoundingClientRect());
  if (
    !globeContainer ||
    globeContainer.getBoundingClientRect().width === 0 ||
    globeContainer.getBoundingClientRect().height === 0
  ) {
    console.error("Globe container has zero size or is not found");
    return;
  }

  globe = Globe()(globeContainer)
    .globeImageUrl(
      "//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
    )
    .backgroundImageUrl(
      "//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png"
    );
  globe = Globe()(globeContainer)
    .globeImageUrl(
      "//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
    )
    .backgroundImageUrl(
      "//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png"
    )
    .htmlElementsData(places.features) // Use HTML elements instead of labels
    .htmlLat((d) => d.properties.latitude)
    .htmlLng((d) => d.properties.longitude)
    .htmlElement((d) => {
      const el = document.createElement("div");
      el.innerHTML = `
              <div style="
                background: #00ffff;
                color: #000;
                padding: 4px 12px;
                font-family: 'Poppins', sans-serif;
                font-size: 12px;
                font-weight: 400;
                white-space: nowrap;
                box-shadow: 0 2px 8px rgba(0, 255, 255, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(4px);   
                clip-path: polygon(0px 0px, 100% 0px, 100% 100%, 10px 100%, 0px 20px);     
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
              ">${d.properties.name}</div>
            `;

      // Add hover effect
      const labelDiv = el.firstElementChild;
      labelDiv.addEventListener("mouseenter", () => {
        labelDiv.style.transform = "scale(1.1)";
        labelDiv.style.boxShadow = "0 4px 16px rgba(0, 255, 255, 0.5)";
      });
      labelDiv.addEventListener("mouseleave", () => {
        labelDiv.style.transform = "scale(1)";
        labelDiv.style.boxShadow = "0 2px 8px rgba(0, 255, 255, 0.3)";
      });

      return el;
    })
    .htmlAltitude(() => 0.02);

  if (!globe) {
    console.error("Failed to initialize Globe");
    return;
  }

  setupFilterEventListeners();
  updateRegionCounts(places);
}

// Setup event listeners for filter checkboxes
function setupFilterEventListeners() {
  const regionMappings = [
    { id: "filter-uk", region: "uk" },
    { id: "filter-spain", region: "spain" },
    { id: "filter-ksa", region: "ksa" },
    { id: "filter-usa-florida", region: "usa-florida" },
    { id: "filter-vietnam", region: "vietnam" },
  ];

  regionMappings.forEach(({ id, region }) => {
    document.getElementById(id).addEventListener("change", function () {
      console.log(`${id} changed:`, this.checked);
      handleRegionChange(id, region);
    });
  });
}

// Initialize with sample data
document.addEventListener("DOMContentLoaded", () => {
  updateRegionCounts(sampleData);
  initGlobe(sampleData);

  // Set initial view to UK after globe is initialized
  setTimeout(() => {
    if (globe) {
      moveToRegion("uk");
    }
  }, 1000); // Wait 1 second for globe to fully initialize
});
