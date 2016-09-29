<?php
const TOKEN_COOKIE = 'gieh4aiK';

$basedir = dirname(__FILE__);
$json_path = $basedir . '/data.json';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.0 404 Not Found', true, 404);
    exit();
}

if ($_COOKIE['token'] !== TOKEN_COOKIE) {
    header('HTTP/1.0 403 Forbidden', true, 403);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

$loc_str = explode(',', $data['loc']);
$data['date'] = date('r');
$data['loc'] = array(
    doubleval($loc_str[0]),
    doubleval($loc_str[1])
);

$raw_data = json_encode($data);
file_put_contents($json_path, $raw_data);

exit();
