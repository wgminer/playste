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
 
$route['users'] = ($_SERVER['REQUEST_METHOD'] == 'GET') ? 'users/get' : 'users/create';
$route['users/auth'] = 'users/auth';
$route['users/unauth'] = 'users/unauth';
$route['users/(:num)'] = ($_SERVER['REQUEST_METHOD'] == 'GET') ? 'users/get/$1' : 'users/update/$1';

// FAVORITE ROUTES

$route['favorites'] = ($_SERVER['REQUEST_METHOD'] == 'GET') ? 'favorites/index' : 'favorites/create';
$route['favorites/delete/(:num)'] = 'favorites/delete/$1';

// TRAK ROUTES

$route['traks'] = ($_SERVER['REQUEST_METHOD'] == 'GET') ? 'traks/index' : 'traks/create';
$route['traks/activate/(:num)'] = 'traks/activate/$1';
$route['traks/deactivate/(:num)'] = 'traks/deactivate/$1';
$route['traks/delete/(:num)'] = 'traks/delete/$1';
$route['traks/(:any)'] = ($_SERVER['REQUEST_METHOD'] == 'GET') ? 'traks/get/$1' : 'traks/update/$1';

// CHANNEL ROUTES 

$route['channels'] = ($_SERVER['REQUEST_METHOD'] == 'GET') ? 'channels/index' : 'channels/create';
$route['channels/activate/(:num)'] = 'channels/activate/$1';
$route['channels/deactivate/(:num)'] = 'channels/deactivate/$1';
$route['channels/delete/(:num)'] = 'channels/delete/$1';
$route['channels/update/(:num)'] = 'channels/update/$1';
$route['channels/(:any)'] = ($_SERVER['REQUEST_METHOD'] == 'GET') ? 'channels/get/$1' : 'channels/update/$1';

// IMPORT ROUTES

$route['v2_import/all'] = 'channels/v2_import_all'; 
$route['v2_import/(:num)'] = 'channels/v2_import/$1';

$route['v3_import/all'] = 'channels/v3_import_all'; 
$route['v3_import/(:num)'] = 'channels/v3_import/$1';

/* End of file routes.php */
/* Location: ./application/config/routes.php */