<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	http://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There area two reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router what URI segments to use if those provided
| in the URL cannot be matched to a valid route.
|
*/

$route['default_controller'] = 'admin';
$route['404_override'] = '';

// ADMIN ROUTES

$route['dashboard'] = 'admin/dashboard';

// USER ROUTES
 
$route['users/auth'] = 'users/auth';
$route['users/unauth'] = 'users/unauth';

$route['users'] = ($_SERVER['REQUEST_METHOD'] == 'GET') ? 'users/get' : 'users/create';
$route['users/(:num)'] = ($_SERVER['REQUEST_METHOD'] == 'GET') ? 'users/get/$1' : 'users/update/$1';

// PLAYLIST ROUTES 

$route['playlists'] = ($_SERVER['REQUEST_METHOD'] == 'GET') ? 'playlists/index' : 'playlists/create';
$route['playlists/test'] = 'playlists/test';
$route['playlists/(:any)'] = ($_SERVER['REQUEST_METHOD'] == 'GET') ? 'playlists/get/$1' : 'playlists/update/$1';

// SONGS ROUTES 

$route['songs'] = ($_SERVER['REQUEST_METHOD'] == 'GET') ? 'songs/index' : 'songs/create';
$route['songs/(:any)'] = ($_SERVER['REQUEST_METHOD'] == 'GET') ? 'songs/get/$1' : 'songs/update/$1';

// USER PLAYLISTS ROUTES

$route['playlistusers/add'] = 'playlistusers/add';
$route['playlistusers/remove'] = 'playlistusers/remove';
$route['playlistusers/(:num)'] = 'playlistusers/get/$1';

/* End of file routes.php */
/* Location: ./application/config/routes.php */