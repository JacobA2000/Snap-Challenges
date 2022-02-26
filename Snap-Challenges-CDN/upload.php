<?php

//CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

$publicID = isset($_POST['user_public_id']) ? $_POST['user_public_id'] : "unknownPubID";
$encodedImage = isset($_POST['image']) ? $_POST['image'] : "";
$uploadTargetDir = "assets/images/user/".$publicID."/";

//MAKE THE USERS DIRECTORY IF IT DOESN'T EXIST
if (!file_exists($uploadTargetDir)) {
    mkdir($uploadTargetDir, 0777, true);
}

$image_parts = explode(";base64,", $encodedImage);
$image_type_aux = explode("image/", $image_parts[0]);
$image_type = $image_type_aux[1];

if( $image_type != "jpeg" && $image_type != "png" && $image_type != "jpg" ) {
    $result = array('result' => '500' ,'msg' => 'Sorry, only JPG, JPEG, & PNG files are allowed.' );
    echo json_encode($result);
} else {
    $image_base64 = base64_decode($image_parts[1]);
    $file = $uploadTargetDir . uniqid() . '.jpg';
    
    if(file_put_contents($file, $image_base64)) {
        $result = array('result' => '200' ,'msg' => 'Imaged uploaded successfully...' , 'path' => $file );
        echo json_encode($result);
    } else {
        $result = array('result' => '500' ,'msg' => 'Sorry, there was an error uploading your file. Try again later.' );
        echo json_encode($result);
    }
}
?>