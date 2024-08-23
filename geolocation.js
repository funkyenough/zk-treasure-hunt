// ボタンを押した時の処理
document.getElementById("btn").onclick = function(){
    // 位置情報を取得する
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
};

// 取得に成功した場合の処理
function successCallback(position){
    // 緯度を取得し画面に表示
    var latitude = position.coords.latitude;
    // 経度を取得し画面に表示
    var longitude = position.coords.longitude;

    document.getElementById("latitude").innerHTML = latitude;
    document.getElementById("longitude").innerHTML = longitude;

    //


    latitude = 40.7128;
    longitude = -74.0060;
   
    var zkGeoPoint = new ZKGeoPoint(latitude, longitude);
   // document.getElementById("zkgeopoint").innerHTML = zkGeoPoint;
   
    var polygon = new ZKThreePointPolygon(
       { latitude: 40.7128, longitude: -74.0060 },
       { latitude: 40.7129, longitude: -74.0061 },
       { latitude: 40.7130, longitude: -74.0062 }
     );
     
   var proof = make_proof(zkGeoPoint, polygon);
   
   if (proof.verify()) {
    document.getElementById("proof").innerHTML = "verified"
   }else{
    document.getElementById("proof").innerHTML = "not_verified"     
   }


};

async function make_proof(point, polygon) {
    return await point.Prove.inPolygon(polygon); 
}

// 取得に失敗した場合の処理
function errorCallback(error){
    alert("位置情報が取得できませんでした");
};
