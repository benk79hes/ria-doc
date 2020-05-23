<?php

class Database
{
	public static $DB = null;


	public static function get($type, $host, $name, $user, $pass = null)
	{
		if (self::$DB == null) {
			try {
				self::$DB = new PDO($type.":host=".$host.";dbname=".$name, $user, $pass);
			} 
			catch (PDOException $e) {
				die($e->getMessage());
			}

			self::$DB->exec("SET NAMES UTF8");
		}
		
		return self::$DB;
	}

}

?>