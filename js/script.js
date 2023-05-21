const purpose = document.getElementById('purpose')
const sort = document.getElementById('sort')
const minPrice = document.getElementById('min-price')
const maxPrice = document.getElementById('max-price')
const maxArea = document.getElementById('max-area')
const minArea = document.getElementById('min-area')
const minRooms = document.getElementById('min-rooms')
const maxRooms = document.getElementById('max-rooms')
const minBaths = document.getElementById('min-baths')
const furnished = document.getElementById('furnished')
const form = document.getElementById('filter')

const filters = [
  purpose,
  sort,
  minPrice,
  maxPrice,
  maxArea,
  minArea,
  minRooms,
  maxRooms,
  minBaths,
  furnished,
]

const global = {
  url: location.pathname,
  api: {
    url: 'https://bayut.p.rapidapi.com',
  },
}

async function displayProperties() {
  const { hits: properties } = await fetchAPIData(
    window.location.search === ''
      ? '/properties/list?locationExternalIDs=5002%2C6020&purpose=for-sale&hitsPerPage=25&page=0&lang=en&sort=city-level-score&rentFrequency=monthly&categoryExternalID=4&priceMin=100000'
      : `/properties/list?locationExternalIDs=5002%2C6020&${
          window.location.search.split('?')[1]
        }`
  )

  console.log(properties)

  properties.forEach((property) => {
    const div = document.createElement('div')
    div.className =
      'max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 h-full'

    div.innerHTML = `
        <a href="/details.html?id=${property.externalID}">
            <img class="rounded-t-lg h-[30%] md:h-[40%] xl:h-1/2 w-full" src="${
              property.coverPhoto.url
            }" alt="" />
        </a>
        <div class="p-5">
            <a href="#">
            <h5
                class="mb-2 text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
                ${property.title}
            </h5>
            </a>
            <div class="flex gap-4">
            <p class="mb-4"><i class="fa-solid fa-bed"></i> ${
              property.rooms
            }</p>
            <p class="mb-4"><i class="fa-solid fa-bath"></i> ${
              property.baths
            }</p>
            <p class="mb-4">Area: ${property.area.toFixed(0)}sqft</p>
            </div>
            <p class="text-2xl font-bold mb-3">&euro;${property.price.toLocaleString()}</p>
            <a
            href="/details.html?id=${property.externalID}"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
            Read more
            <svg
                aria-hidden="true"
                class="w-4 h-4 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
                ></path>
            </svg>
            </a>
        </div>
  `

    document.getElementById('properties').appendChild(div)
  })
}

async function displayDetails() {
  const property = await fetchAPIData(
    `/properties/detail?externalID=${location.search.split('=')[1]}`
  )
  const div = document.createElement('div')
  div.className =
    'flex flex-col items-center items-start justify-center gap-20 m-1 md:m-12 lg:m-24 lg:mx-12'

  div.innerHTML = `
            <div class="flex flex-col gap-6 w-[80%] lg:w-1/2">
            <img src="${property.coverPhoto.url}" alt="" />
            <div class="flex gap-4">
            <div class="space-x-2">
                <i class="fa-solid fa-bed"></i>
                <span>${property.rooms}</span> |
            </div>
            <div class="space-x-2">
                <i class="fa-solid fa-bath"></i>
                <span>${property.baths}</span> |
            </div>
            <div class="space-x-2"><span>Area: ${property.area.toFixed(
              0
            )}</span>sqft |</div>
            <div class="space-x-2"><span>${
              property.purpose === 'for-rent' ? 'For Rent' : 'For Sale'
            }</span> |</div>
            <div>
                <i class="fa-solid ${
                  property.furnishingStatus === 'furnished'
                    ? 'fa-check text-green-400'
                    : 'fa-x text-red-500'
                }"></i>
                <span>${
                  property.furnishingStatus === 'furnished'
                    ? 'Furnished'
                    : 'Unfurnished'
                }</span>
            </div>
            <div class="space-x-2">
                <i class="fa-solid fa-phone"></i>
                <span>${property.phoneNumber.mobile}</span>
            </div>
            </div>
            <h2 class="text-4xl font-bold">&euro;${property.price.toLocaleString()}</h2>
        </div>
        <div class="space-y-12 w-[80%] lg:w-1/2">
            <h1 class="text-3xl font-bold">
            ${property.title}
            </h1>
            <p>
            ${property.description}
            </p>
        </div>
        <button
            type="button"
            class="w-1/2 py-3 text-center rounded-lg bg-[#1F2937] font-bold hover:scale-[0.995] focus:scale-[0.990]"
        >
            Contact
        </button>
    `

  const map = L.map('map').setView([0, 0], 2)

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)

  const marker = L.marker([0, 0]).addTo(map)

  marker.setLatLng([property.geography.lat, property.geography.lng]).update()
  map.setView([property.geography.lat, property.geography.lng], 13)

  document.getElementById('container').appendChild(div)
}

async function fetchAPIData(endpoint) {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'fec5af1b08mshc663a5ea0c78b87p11a492jsn0f7a5aa7e923',
      'X-RapidAPI-Host': 'bayut.p.rapidapi.com',
    },
  }
  const response = await fetch(`${global.api.url}${endpoint}`, options)
  const data = await response.json()

  return data
}

function init() {
  switch (global.url) {
    case '/':
    case '/index.html':
      displayProperties()
      break
    case '/details.html':
      displayDetails()
      break
  }

  form.addEventListener('submit', () => {
    displayProperties()
  })
}

document.addEventListener('DOMContentLoaded', init)
