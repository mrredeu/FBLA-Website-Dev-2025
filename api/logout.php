<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
session_start();
session_unset();
session_destroy();
header("Location: /homepage");
exit();
