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

function Map() {
  
  const [markerList, setMarkerList] = useState<{name: string, marker: L.Marker}[]>([]);

  const customIcon = new Icon({
    iconUrl: require("./marker.png"),
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

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map', {
        center: [46.554628, 15.645886],
        zoom: 14,
        maxZoom: 22,
      });
      mapRef.current = map;

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
    tags: string[];
    ratings: any[];
    __v: number;
    averageRating: number;
    id: string;
  }

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const markerListReference = useRef<{name: string, marker: L.Marker}[]>([]);

  const [searchBy, setSearchBy] = useState('');
  const debouncedSetSearchBy = debounce((value) => setSearchBy(value), 250);

  var clicked = false;

  useEffect(() => {
    const filterRestaurants = restaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchBy.toLowerCase())
    );
    handleMap(filterRestaurants);
  }, [searchBy])

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

  const handleMap = (data: Restaurant[]) => {
    if (markerClusterReference.current) {
      markerClusterReference.current.clearLayers();
    }

/*     const markerCluster = new window.L.MarkerClusterGroup({
      showCoverageOnHover: false,
      iconCreateFunction: createCustomClusterIcon
    }); */

    //markerClusterReference.current = markerCluster;

    const newMarkerList: {name: string, marker: L.Marker<any>}[] = [];
    data.forEach(restaurant => {
      let [latitude, longitude] = restaurant.location.coordinates;
      let flippedCoords = [longitude, latitude];

      

      const marker = L.marker(flippedCoords as L.LatLngTuple, { icon: customIcon })
      //.addTo(markerCluster)
      .addTo(mapRef.current!)
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

/*     if (mapRef.current) {
      mapRef.current.addLayer(markerCluster);
    } */
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

  return (
    <div className={styles['container']}>

      <div id="map" className={styles['map']}>
        <div className={styles['search-bar']} style={{zIndex: 999, position: 'relative'}}>
          <input 
              type='text' 
              placeholder='Išči po imenu'
              onKeyUp={(event) => {
                  debouncedSetSearchBy(event.currentTarget.value);
          }}/>
        </div>
      </div>

      {displayTopRestaurants ?
        <div className={styles['restaurants']}>
          <div className={styles['restaurants-header']}>TOP RESTAVRACIJE</div>
          {restaurants.map((restaurant) => (
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
            <Button type='primary' width='100%'>Več</Button>
            <Button type='primary' width='100%' onClick={() => backButton()}>Nazaj</Button>
          </div>
        </div>
      }
    </div>
  );
}

export default Map;