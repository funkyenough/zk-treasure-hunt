import { ZKGeoPoint } from 'zklocus';

const latitude = 40.7128;
const longitude = -74.0060;

var zkGeoPoint = new ZKGeoPoint(latitude, longitude);

var polygon = new ZKThreePointPolygon(
   { latitude: 40.7128, longitude: -74.0060 },
   { latitude: 40.7129, longitude: -74.0061 },
   { latitude: 40.7130, longitude: -74.0062 }
 );
 
var proof = make_proof(zkGeoPoint, polygon);
   
if (proof.verify()) {
    print ("verified")
   }else{
    print("not_verified")   
   };

async function make_proof(point, polygon) {
    return await point.Prove.inPolygon(polygon)
};
