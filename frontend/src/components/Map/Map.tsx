import React, { useState, useEffect, useRef } from 'react';
import { point } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import styles from './Map.module.scss';
import { Icon, divIcon } from 'leaflet';

import * as L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import Button from '../Button/Button';
import { debounce } from 'lodash';

import { getApiCall } from '../../api/apiCalls';
import { motion } from 'framer-motion';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


function Map() {
  
  const [markerList, setMarkerList] = useState<{name: string, marker: L.Marker}[]>([]);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string[]>([]);

  const customIcon = new Icon({
    iconUrl: require("./marker.png"),
    iconSize: [38, 38]
  })
  const blackMarkerIcon = new Icon({
    iconUrl: require("./marker-black.png"),
    iconSize: [38, 38]
  })

  const createCustomClusterIcon = (cluster: any) => {
    const count = cluster.getChildCount();
  
    return L.divIcon({
      html: `<div class="${styles['custom-cluster']}">${count}</div>`,
      className: styles['marker-cluster'],
      iconSize: L.point(40, 40),
    });
  };
  
  const mapRef = useRef<L.Map | null>(null);
  const markerClusterReference = useRef<any>(null);
  const isPlacingMarker = useRef(false);
  const [markerPlaced, setMarkerPlaced] = useState(false)
  const [radiusDistance, setRadiusDistance] = useState("")
  //const [coords, setCoords] = useState<L.LatLng>()
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [sortWithRadius, setSortWithRadius] = useState(false);
  //const [circleLayer, setCircleLayer] = useState<L.Circle | null>(null);
  const circleLayer = useRef<L.Circle | null>(null);

  const [inputValue, setInputValue] = useState('');
  const [clear, setClear] = useState(0);
  const [marker, setMarker] = useState<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map', {
        center: [46.554628, 15.645886],
        zoom: 14,
        maxZoom: 22,
      });
      mapRef.current = map;

      map.on('click', function(e) {
        console.log("Is placing marker current: " + isPlacingMarker.current);
        console.log("Marker placed: " + markerPlaced);
        if (isPlacingMarker.current) {
          isPlacingMarker.current = false;
          //markerPlaced.current = true
          setMarkerPlaced(true);

          var coord = e.latlng;
          var lat = coord.lat;
          var lng = coord.lng;
          setLongitude(lng);
          setLatitude(lat);
/*
          console.log("Longitude: " + longitude + "|Latitude: " + latitude) */

          /* console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
          console.log(coord); */

          const marker = L.marker(coord, { icon: blackMarkerIcon })
          .on('click', e => {
            if (mapRef.current) {
              debugger;
              e.target.remove();
              //markerPlaced.current = false;
              setMarkerPlaced(false);
              //console.log(circleLayer)
              
              setClear(clear + 1);
            }
          });
          setMarker(marker);

          if (mapRef.current) {
            mapRef.current.addLayer(marker);
          }
        }
      });

      L.tileLayer('https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
        attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 22,
        accessToken: 'nF3h6bDTDG8BmNfnWiMMPfdLv9u59XAdCbISvq8pcVusAWl2FATOJi2noVd44y1q',
      }).addTo(map);
    }

    
  
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);


  
  const drawCircle = () => {
    if (circleLayer.current) {
      circleLayer.current.remove();
    }

    var r = parseInt(radiusDistance);
    if (isNaN(r)) {
      r = 0;
      console.log("CIGANNN")
    } else {
      setSortWithRadius(true)
    }

    const newCircle = L.circle([latitude, longitude], {
      color: 'black',
      fillColor: 'black',
      fillOpacity: 0.1,
      radius: r,
    }).addTo(mapRef.current!);
  
    //setCircleLayer(newCircle);
    circleLayer.current = newCircle
  };

  useEffect(() => {
    console.log("Longitude: " + longitude + "|Latitude: " + latitude);
  }, [longitude, latitude]);

  interface WorkingHours {
    day: string;
    open: string;
    close: string;
    _id: string;
    id: string;
  }

  interface Photo {
    _id: string;
    imagePath: string;
    __v: number;
  }

  interface Tag {
    _id: string;
    name: string;
  }  

  interface Restaurant {
    _id: string;
    name: string;
    address: string;
    description: string;
    location: {
      type: string;
      coordinates: [number, number];
    };
    owner: string;
    photo: Photo; // Updated photo interface
    mealPrice: number;
    mealSurcharge: number;
    workingHours: WorkingHours[];
    tags: Tag[];
    ratings: any[];
    __v: number;
    averageRating: number;
    id: string;
  }

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [radiusRestaurants, setRadiusRestaurants] = useState<Restaurant[]>([]);
  const markerListReference = useRef<{name: string, marker: L.Marker}[]>([]);

  const [searchBy, setSearchBy] = useState('');
  const debouncedSetSearchBy = debounce((value) => setSearchBy(value), 250);

  var clicked = false;

  useEffect(() => {
    console.log(sortBy);
    


    console.log("SORT WITH RADIUS: " + sortWithRadius)
    
    var filterRestaurants;
    if (sortWithRadius) {
      filterRestaurants = radiusRestaurants.filter(restaurant => {
        const nameMatch = restaurant.name.toLowerCase().includes(searchBy.toLowerCase());

        const tagsMatch = Array.isArray(restaurant.tags) && sortBy.every(tag => restaurant.tags.some(t => t.name.includes(tag)));
        return nameMatch && tagsMatch;
      });
    }
    else {
      filterRestaurants = restaurants.filter(restaurant => {
        const nameMatch = restaurant.name.toLowerCase().includes(searchBy.toLowerCase());

        const tagsMatch = Array.isArray(restaurant.tags) && sortBy.every(tag => restaurant.tags.some(t => t.name.includes(tag)));
        return nameMatch && tagsMatch;
      });
    }
    console.log("filter restaurants" + filterRestaurants)

    handleMap(filterRestaurants);
  }, [searchBy, sortBy])

  useEffect(() => {
    debugger;
    if (circleLayer.current) {
      circleLayer.current.remove();
    }
    if (marker) {
      marker.remove();
      setMarkerPlaced(false);
      isPlacingMarker.current = false;
    }
    setSortBy([])
  }, [clear])

  useEffect(() => {
    const getRestaurants = async () => {
      const res = await fetch(`http://${process.env.REACT_APP_URL}:3001/restaurants`);
      const data: Restaurant[] = await res.json();
      console.log(data);
      setRestaurants(data);

      handleMap(data);
    }
    getRestaurants();
  }, []);



  useEffect(() => {
    drawCircle();
    console.log(circleLayer)

    const getRestaurantsNear = async () => {
      console.log("Longitude: " + longitude + "|Latitude: " + latitude)
      const res = await fetch(`http://${process.env.REACT_APP_URL}:3001/restaurants/near?lon=${longitude}&lat=${latitude}&distance=${radiusDistance}`);
      const data: Restaurant[] = await res.json();
      setRadiusRestaurants(data);
      
      handleMap(data);
    }
    getRestaurantsNear();
  }, [radiusDistance])

  const handleMap = (data: Restaurant[]) => {
    if (markerClusterReference.current!) {
      markerClusterReference.current.clearLayers();
    }

    const markerCluster = new window.L.MarkerClusterGroup({
      showCoverageOnHover: false,
      iconCreateFunction: createCustomClusterIcon
    });

    markerClusterReference.current = markerCluster;

    const newMarkerList: {name: string, marker: L.Marker<any>}[] = [];
    data.forEach(restaurant => {
      console.log("RESTAURANT" + restaurant.location.coordinates)
      let [latitude, longitude] = restaurant.location.coordinates;
      let flippedCoords = [longitude, latitude];

      const marker = L.marker(flippedCoords as L.LatLngTuple, { icon: customIcon })
      .addTo(markerCluster)
      .bindTooltip(
        `<div class="${styles.hoverDiv}">
          <div class="${styles.hoverDivTitle}">${restaurant.name}</div>
          <div class="${styles.hoverDivImg}"><img src="http://${process.env.REACT_APP_URL}:3001${restaurant.photo.imagePath}" alt="restaurant" /></div>
        </div>`,
        { direction: 'top',
          offset: L.point(0, 20)
         }
      )
      .on('click', () => handleMarkerClick(restaurant));
      
      newMarkerList.push({name: restaurant.name, marker: marker});
      
    });

    setMarkerList(newMarkerList);
    markerListReference.current = newMarkerList;

    console.log("marker list:  " + newMarkerList);
    console.log("marker reference list: " + markerListReference.current);

    if (mapRef.current) {
      mapRef.current.addLayer(markerCluster);
    }
  }

  const handleMarkerClick = (restaurant: Restaurant) => {
    
    if (clicked == false) {
      clicked = true;
      markerListReference.current.forEach(marker => {
        if (marker.name != restaurant.name) {
          console.log("MARKER HIDDEN:" + marker.name)
          marker.marker.setOpacity(0);
          if (markerClusterReference.current) {
            markerClusterReference.current.removeLayer(marker.marker);
          }
        }
      })

      displayRestaurant(restaurant);
    }
    else {
      console.log("else:" + clicked)
      backButton();
    }
  }

  const [displayTopRestaurants, setDisplayRestaurants] = useState(true);
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant>();
 
  const displayRestaurant = (restaurant: Restaurant) => {
    //console.log(restaurant);
    clicked = true;
    setDisplayRestaurants(false);
    setActiveRestaurant(restaurant);

    markerListReference.current.forEach(marker => {
      if (marker.name != restaurant.name) {
        console.log("MARKER HIDDEN:" + marker.name)
        marker.marker.setOpacity(0);
        if (markerClusterReference.current) {
          markerClusterReference.current.removeLayer(marker.marker);
        }
      }
    })
  }

  const backButton = () => {
    console.log("back button:" + clicked)
    setDisplayRestaurants(true);
    setActiveRestaurant(undefined);
    clicked = false;

    markerListReference.current.forEach(marker => {
      marker.marker.setOpacity(1);
      if (markerClusterReference.current) {
        markerClusterReference.current.addLayer(marker.marker);
      }
    })
  }

  const [workingHours, setWorkingHours] = useState("")

  function isOpen(close: string, open: string): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    now.setHours(currentHour, currentMinutes);

    const [openHour, openMinutes] = open.split(':').map(Number);
    const [closeHour, closeMinutes] = close.split(':').map(Number);


    const openTime = new Date();
    openTime.setHours(openHour, openMinutes);
    const closeTime = new Date();
    closeTime.setHours(closeHour, closeMinutes);

    if (now >= closeTime && now <= openTime) {
      return true;
    }
    return false;
  }

  function getCurrentDay(): string {
    const date = new Date();
    const days = ["Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota", "Nedelja"]
    const dayIndex = date.getDay();
    return days[dayIndex];
  }

  const getClosingTime = (restaurant: Restaurant | undefined): string =>  {
    if (restaurant) {
      var returnString = "";
      restaurant?.workingHours.map((day: WorkingHours, index: number) => {
        if (day.day == getCurrentDay()) {
          if (!isOpen(day.close, day.open)) {
            returnString += "Odprto, zapre se ob " + day.close;
            return returnString
          }
          else {
            const nextDay = restaurant.workingHours[index + 1]
            returnString += "Zaprto, odpre se ob " + nextDay.open;
            return returnString;
          }
        }
      })
      return returnString;
    }
    return "";
  }


  const navigate = useNavigate();
  return (
    <div className={styles['container']}>
      <div id="map" className={styles['map']}>
        <div className={styles['search-bar']} style={{zIndex: 2, position: 'relative', display: 'flex'}}>
          <input 
              type='text' 
              placeholder='Išči po imenu'
              onKeyUp={(event) => {
                  debouncedSetSearchBy(event.currentTarget.value);
          }}/>
          <div className={styles['marker-button-holder']}>
            
            <button className={`${styles['set-marker-button']} ${markerPlaced ? styles['active-marker-placed'] : ''}`}
              onClick={(event) => {
                if (markerPlaced == true) {
                  console.log("MARKER PLACED FUCK OFF");
                  return
                }
                console.log("Marker placed: " + markerPlaced)
                event.stopPropagation(); 
                event.preventDefault(); 
                isPlacingMarker.current = true;
              }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </button>
          </div>
        </div>
      </div>
        
      <motion.div className={styles['sidebar']} style={{zIndex: 1000}} animate={{x: isSidebarOpen ? 0 : -250}}>
        <div className={styles['show-sidebar']} onClick={() => {!isSidebarOpen ? setSidebarOpen(true) : setSidebarOpen(false)}}>
          <i className="fa-solid fa-chevron-right"></i>
        </div>
        <div className={styles['sidebar-title']}>
          <h1>FILTRIRAJ</h1>
        </div>
        <div className={styles['sidebar-content']}>
          <div className={styles['switch-div']}>
            <div className={styles['switch-container']}>
                <label className={styles['switch']}>
                <input 
                    type="checkbox" 
                    checked={sortBy.includes('meso')}
                    onChange={(e) => { 
                        if (e.target.checked) {
                            setSortBy(prevSortBy => [...prevSortBy, 'meso']);
                        } else {
                            setSortBy(prevSortBy => prevSortBy.filter(item => item !== 'meso'));
                        }
                    }} 
                />
                    <span className={`${styles['slider']} ${styles['round']}`}/>
                </label>
            </div>
            Meso
          </div>
          <div className={styles['switch-div']}>
            <div className={styles['switch-container']}>
                <label className={styles['switch']}>
                  <input 
                      type="checkbox" 
                      checked={sortBy.includes('mešano')}
                      onChange={(e) => { 
                          if (e.target.checked) {
                              setSortBy(prevSortBy => [...prevSortBy, 'mešano']);
                          } else {
                              setSortBy(prevSortBy => prevSortBy.filter(item => item !== 'mešano'));
                          }
                      }} 
                  />
                  <span className={`${styles['slider']} ${styles['round']}`}/>
                </label>
            </div>
            Mešano
          </div>
          <div className={styles['switch-div']}>
            <div className={styles['switch-container']}>
                <label className={styles['switch']}>
                  <input 
                      type="checkbox" 
                      checked={sortBy.includes('vegetarijansko')}
                      onChange={(e) => { 
                          if (e.target.checked) {
                              setSortBy(prevSortBy => [...prevSortBy, 'vegetarijansko']);
                          } else {
                              setSortBy(prevSortBy => prevSortBy.filter(item => item !== 'vegetarijansko'));
                          }
                      }} 
                  />
                  <span className={`${styles['slider']} ${styles['round']}`}/>
                </label>
            </div>
            Vegetarijansko
          </div>
          <div className={styles['switch-div']}>
            <div className={styles['switch-container']}>
                <label className={styles['switch']}>
                  <input 
                      type="checkbox" 
                      checked={sortBy.includes('solata')}
                      onChange={(e) => { 
                          if (e.target.checked) {
                              setSortBy(prevSortBy => [...prevSortBy, 'solata']);
                          } else {
                              setSortBy(prevSortBy => prevSortBy.filter(item => item !== 'solata'));
                          }
                      }} 
                  />
                  <span className={`${styles['slider']} ${styles['round']}`}/>
                </label>
            </div>
            Solata
          </div>
          <div className={styles['switch-div']}>
            <div className={styles['switch-container']}>
                <label className={styles['switch']}>
                  <input 
                    type="checkbox" 
                    checked={sortBy.includes('morski-sadeži')}
                    onChange={(e) => { 
                        if (e.target.checked) {
                            setSortBy(prevSortBy => [...prevSortBy, 'morski-sadeži']);
                        } else {
                            setSortBy(prevSortBy => prevSortBy.filter(item => item !== 'morski-sadeži'));
                        }
                    }} 
                  />
                  <span className={`${styles['slider']} ${styles['round']}`}/>
                </label>
            </div>
            Morski sadeži
          </div>
          <div className={styles['switch-div']}>
            <div className={styles['switch-container']}>
                <label className={styles['switch']}>
                  <input 
                      type="checkbox" 
                      checked={sortBy.includes('pizza')}
                      onChange={(e) => { 
                          if (e.target.checked) {
                              setSortBy(prevSortBy => [...prevSortBy, 'pizza']);
                          } else {
                              setSortBy(prevSortBy => prevSortBy.filter(item => item !== 'pizza'));
                          }
                      }} 
                  />
                  <span className={`${styles['slider']} ${styles['round']}`}/>
                </label>
            </div>
            Pizza
          </div>
          <div className={styles['switch-div']}>
            <div className={styles['switch-container']}>
                <label className={styles['switch']}>
                  <input 
                      type="checkbox" 
                      checked={sortBy.includes('hitra-hrana')}
                      onChange={(e) => { 
                          if (e.target.checked) {
                              setSortBy(prevSortBy => [...prevSortBy, 'hitra-hrana']);
                          } else {
                              setSortBy(prevSortBy => prevSortBy.filter(item => item !== 'hitra-hrana'));
                          }
                      }} 
                  />
                  <span className={`${styles['slider']} ${styles['round']}`}/>
                </label>
            </div>
            Hitra hrana
          </div>
          <div className={styles['switch-div']}>
            <div className={styles['switch-container']}>
                <label className={styles['switch']}>
                  <input 
                      type="checkbox" 
                      checked={sortBy.includes('celiakiji-prijazni-obroki')}
                      onChange={(e) => { 
                          if (e.target.checked) {
                              setSortBy(prevSortBy => [...prevSortBy, 'celiakiji-prijazni-obroki']);
                          } else {
                              setSortBy(prevSortBy => prevSortBy.filter(item => item !== 'celiakiji-prijazni-obroki'));
                          }
                      }} 
                  />
                  <span className={`${styles['slider']} ${styles['round']}`}/>
                </label>
            </div>
            Celiakiji prijazni obroki
          </div>
          <div className={styles['radius-interface']}>
            <input 
              type='text' 
              placeholder='Polmer v metrih' 
              value={inputValue} 
              onChange={e => setInputValue(e.target.value)}
            />
            <Button type='primary' width='32%' onClick={() => setRadiusDistance(inputValue)}>Poišči</Button>
          </div>
          <div className={styles['clear-choice-div']}>
            <Button type='primary' width='100%' onClick={() => {setSortWithRadius(false); setClear(clear + 1)}}>Počisti izbiro</Button>
          </div>
        </div>
      </motion.div>
        
      {displayTopRestaurants ?
        <div className={styles['restaurants']}>
          <div className={styles['restaurants-header']}>PRIPOROČAMO</div>
          {restaurants
            /* .sort(() => 0.5 - Math.random()) */
            .slice(0, 5)
            .map((restaurant) => (
              <div key={restaurant._id} className={styles['restaurant-div']} onClick={() => displayRestaurant(restaurant)}>
                <h3>{restaurant.name}</h3>
                <div className={styles['restaurant-photo']}>
                  <img src={`http://${process.env.REACT_APP_URL}:3001${restaurant.photo.imagePath}`} alt="restaurant" />
                </div>
              </div>
          ))}
        </div>
        :
        <div className={styles['restaurant-info']}>
          <div className={styles['upper-div']}>
            <div className={styles['displayed-restaurant-photo']}><img src={`http://${process.env.REACT_APP_URL}:3001${activeRestaurant?.photo.imagePath}`} alt="restaurant" /></div>
            <div className={styles['displayed-restaurant-title']}>{activeRestaurant?.name}</div>
            <div className={styles['displayed-restaurant-info']}>Cena obroka: {activeRestaurant?.mealPrice} €</div>
            <div className={styles['displayed-restaurant-info']}>Doplačilo: {activeRestaurant?.mealSurcharge} €</div>
            <div className={styles['displayed-restaurant-info']}>{activeRestaurant?.address}</div>
            <div className={styles['displayed-restaurant-info']}>Danes: {getClosingTime(activeRestaurant)}</div>
          </div>
          <div className={styles['back-button-container']}>
            <Button type='primary' width='100%' onClick={() => navigate(`/restaurant/${activeRestaurant?.id}`)}>Več</Button>
            <Button type='primary' width='100%' onClick={() => backButton()}>Nazaj</Button>
          </div>
        </div>
      }
    </div>
  );
}

export default Map;