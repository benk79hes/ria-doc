<?php
require_once 'Database.php';

$db = Database::get('mysql', 'h1.valaisweb.com', 'c1_snake', 'c1_snake', 'fe4PRwREur_');

function getRequestUserData()
{
    
}

function reply($message, $status = 200)
{
    $status_messages = [
        200 => "OK",
        400 => "Invalid request"
    ];

    $statusHeader ="HTTP/1.1 $status";
    if (isset($status_messages[$status])) {
        $statusHeader .= ' ' . $status_messages[$status];
    }

    header($statusHeader);

    if ($status != 204) {
        header('Content-type: application/json');
        echo json_encode($message);
    }
    
    die();
}

//print_r($_POST);

switch (@$_GET['action']) {
    case 'addNickname':
        if (!isset($_POST['nickname']))
            reply(['error' => 'missing nickname'], 400);
        
        $nickname = @$_POST['nickname'];
        // echo $nickname;
        $sql = 'insert into `users` (`nickname`) values (?)';
        $stm = $db->prepare($sql);

        if (!$stm->execute([$nickname])) {
            $errorInfo = $stm->errorInfo();
            if ($errorInfo[0] == 23000) {
                reply([
                    'status' = 'error'
                    'message' => 'Nickname exists'
                ]);
            }
            else {
                reply([
                    'status' = 'error'
                    'message' => 'Server error'
                ], 500);
            }
        }

        $uid = md5($db->lastInsertId() . $nickname . time());
        $sql = 'update `users` set `uid` = ?';
        $stm = $db->prepare($sql);
        $stm->execute([$nickname])

        reply([
            'status' = 'success'
            'uid' => $uid
        ]);

        reply(null, 204);
        break;

    case 'setAvatar':
        $uid = $_GET['uid'];
        
        $avatar = $_FILE['avatar'];
        break;

    
    
}

reply([
    'status' = 'error'
    'message' => 'Invalid request'
], 400)
