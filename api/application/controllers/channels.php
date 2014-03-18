<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Channels extends CI_Controller {

    public function index() { // ACTIVE CHANNELS 

        $data = $this->Channel_model->get(array('status' => 1));

        echo json_encode($data);

    }

    public function test() {

        if(date('Ymd') == date('Ymd', strtotime('2014-02-04T17:00:06.000Z'))) {
            echo 'hi';
        } else {
            echo "no";
        }

    }

    public function create() {

        $decoded_channel = json_decode(file_get_contents('php://input'), TRUE);

        $channel_url = $decoded_channel['channel_url'];

        $array = preg_split("/[^A-Za-z0-9 ]/", substr($channel_url, strrpos( $channel_url, 'user/' ) + 5));

        $youtube_title = $array[0];

        $url = 'http://gdata.youtube.com/feeds/api/users/'.$youtube_title.'?v=2&format=5&prettyprint=true&alt=json';

        $json = file_get_contents($url);
        $jsonOutput = json_decode($json);

        // var_dump($jsonOutput);

        $title = $jsonOutput->entry->{'yt$username'}->display;
        $youtube_title = $jsonOutput->entry->{'yt$username'}->{'$t'}; // GET OFFICAL TITLE
        $youtube_id = $jsonOutput->entry->{'yt$channelId'}->{'$t'};
        $published = $jsonOutput->entry->published->{'$t'};

        $slug = url_title($title, '-', TRUE);

        $data = array(
            'title' => $title,
            'slug' => $slug,
            'youtube_id' => $youtube_id,            
            'youtube_title' => $youtube_title,
            'status' => 0, // NOT ACTIVE
            'published' => $published,
            'created' => date('Y-m-d H:i:s'),
            'updated' => date('Y-m-d H:i:s')
        );

        if ($id = $this->Channel_model->create($data)) {
            echo json_encode($id);
        } else {
            header('HTTP', TRUE, 404);
        }

    }

    public function get($id) {

        if (is_numeric($id)) {
            $data = $this->Channel_model->get(array('id' => $id));
        } else {
            $data = $this->Channel_model->get(array('slug' => $id));
        }

        echo json_encode($data);

    }

    public function update($id) {
        if ($this->User_model->is_admin()) {

            $channel = $this->Channel_model->get(array('id' => $id));

            $title = $this->input->post('title');
            $cover_id = $this->input->post('cover_id');

            $data = array(
                'title' => $title,
                'slug' => url_title($title, '-', TRUE),
                'cover_id' => $cover_id,
                'updated' => date('Y-m-d H:i:s')
            );

            if ($this->Channel_model->update($id, $data)) {
                redirect('admin/channel/'.$channel->id);
            }

        }
    }

    public function v2_import_all() {

        $channels = $this->Channel_model->get(array('status' => 1));

        foreach ($channels as $channel) {
            $this->v2_import($channel->id);
        }
    }

    public function v2_import_new($id) {

        if ($channel = $this->Channel_model->get(array('id' => $id, 'status' => 1))) {

            $counter = 0;
            
            for ( $i = 1; $i < 500; $i += $limit) {

                $result = '<p>'.$channel->title.' is up to date!</p>';

                $url = "http://gdata.youtube.com/feeds/api/users/".$channel->youtube_title."/uploads?v=2&alt=jsonc&max-results=50&start-index=".$i."&format=5";
                $json = json_decode(file_get_contents($url));
                $items = $json->data->items;

                if (isset($jsonOutput->data->items)) {

                    foreach ($items as $trak){

                        if ($this->Trak_model->is_new($trak->id)) {

                            $data = array(
                                'title' => $trak->title,
                                'slug' => url_title($trak->title, 'dash', true),
                                'youtube_id' => $trak->id,            
                                'channel_id' => $id,
                                'color_sample' => $this->Trak_model->sample_color($trak->id),
                                'published' => $trak->uploaded,
                                'created' => date('Y-m-d H:i:s'),
                                'updated' => date('Y-m-d H:i:s')
                            );
                            
                            if (!$this->Trak_model->create($data)) {
                                $result = '<p>Error at '.$title.'</p>';
                                break 2;
                            } else {
                                $counter++;
                                $result = '<p>'.$counter . ' new traks added to '.$channel->title.'!</p>';
                            }
                        } else {
                            break 2;
                        }
                    }
                }
            }

            echo $result;

            $this->load->helper('file');
            delete_files('assets/uploads', TRUE);
        } else {
            print('Channel not found or inactive');
        }

    }

    public function v2_import($id) {

        if ($channel = $this->Channel_model->get(array('id' => $id, 'status' => 1))) {

            $counter = 0;
            
            $url = "http://gdata.youtube.com/feeds/api/users/".$channel->youtube_title."/uploads?v=2&alt=jsonc&max-results=1&format=5";
            $json = file_get_contents($url);
            $jsonOutput = json_decode($json);

            $limit = 50; // Max results allowed per page

            if ($jsonOutput->data->totalItems > 500) { // Max histroy allowed
                $total = 500;
            } else {
                $total = $jsonOutput->data->totalItems;
            }
            
            for ( $i = 1; $i < $total; $i += $limit) {

                $result = '<p>'.$channel->title.' is up to date!</p>';

                $url = "http://gdata.youtube.com/feeds/api/users/".$channel->youtube_title."/uploads?v=2&alt=jsonc&max-results=50&start-index=".$i."&format=5";
                $json = json_decode(file_get_contents($url));
                $items = $json->data->items;

                if (isset($jsonOutput->data->items)) {

                    foreach ($items as $trak){

                        if ($this->Trak_model->is_new($trak->id)) {

                            $data = array(
                                'title' => $trak->title,
                                'slug' => url_title($trak->title, 'dash', true),
                                'youtube_id' => $trak->id,            
                                'channel_id' => $id,
                                'color_sample' => $this->Trak_model->sample_color($trak->id),
                                'published' => $trak->uploaded,
                                'created' => date('Y-m-d H:i:s'),
                                'updated' => date('Y-m-d H:i:s')
                            );
                            
                            if (!$this->Trak_model->create($data)) {
                                $result = '<p>Error at '.$title.'</p>';
                                break 2;
                            } else {
                                $counter++;
                                $result = '<p>'.$counter . ' new traks added to '.$channel->title.'!</p>';
                            }
                        }
                    }
                }
            }

            $this->load->helper('file');
            delete_files('assets/uploads', TRUE);
            $this->Channel_model->update($id, array('updated' => date('Y-m-d H:i:s')));

            echo $result;

        } else {
            print('Channel not found or inactive');
        }

    }

    public function v3_import_all() {

        $channels = $this->Channel_model->get(array('status' => 1));

        foreach ($channels as $channel) {
            $this->v3_import($channel->id);
        }
    }

    public function v3_import_new($id) {

        if ($channel = $this->Channel_model->get(array('id' => $id, 'status' => 1))) {
        
            $url = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=".$channel->youtube_id."&maxResults=1&key=AIzaSyCkoszshUaUgV-2CrviQI0I4pTkd8j61gc";
            $json = file_get_contents($url);
            $jsonOutput = json_decode($json);

            $limit = $jsonOutput->pageInfo->resultsPerPage;
            $total = $jsonOutput->pageInfo->totalResults;

            $totalPages = ceil($total / $limit);

            $counter = 0;

            for ( $page_number = 1; $page_number < $totalPages; $page_number++) { // Paginate

                if ($page_number > 1) {
                    $url = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=".$channel->youtube_id."&pageToken=".$token."&maxResults=50&key=AIzaSyCkoszshUaUgV-2CrviQI0I4pTkd8j61gc";
                } else {
                    $url = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=".$channel->youtube_id."&maxResults=50&key=AIzaSyCkoszshUaUgV-2CrviQI0I4pTkd8j61gc";
                }

                $json = file_get_contents($url);
                $jsonOutput = json_decode($json);

                $result = '<p>'.$channel->title.' is up to date!</p>';

                for ( $item_number = 0; $item_number < count($jsonOutput->items); $item_number++ ){

                    if (isset($jsonOutput->items[$item_number]->id->videoId) && $this->Trak_model->is_new($jsonOutput->items[$item_number]->id->videoId) ) {

                        $title = $jsonOutput->items[$item_number]->snippet->title;
                        $slug = url_title($title, '-', TRUE);
                        $youtube_id = $jsonOutput->items[$item_number]->id->videoId;
                        $published = $jsonOutput->items[$item_number]->snippet->publishedAt;
                        $current_time = date('Y-m-d H:i:s');

                        $data = array(
                            'title' => $title,
                            'slug' => $slug,
                            'youtube_id' => $youtube_id,            
                            'channel_id' => $id,
                            'color_sample' => $this->Trak_model->sample_color($youtube_id),
                            'published' => $published,
                            'created' => date('Y-m-d H:i:s'),
                            'updated' => date('Y-m-d H:i:s')
                        );

                        if (!$this->Trak_model->create($data)) {
                            $result = '<p>Error at '.$title.'</p>';
                            break 2;
                        }

                        $counter++;

                        $result = '<p>'.$counter . ' new traks added to '.$channel->title.'!</p>';

                    } else {
                        break 2;
                    }

                }

                if (isset($jsonOutput->nextPageToken)) {

                    $token = $jsonOutput->nextPageToken;

                } else {

                    break 1;

                }

            }

            $this->load->helper('file');
            delete_files('assets/uploads', TRUE);
            $this->Channel_model->update($id, array('updated' => date('Y-m-d H:i:s')));

            echo $result;

        } else {
            print('Channel not found or inactive');
        }
    }

    public function v3_import($id) {

        if ($channel = $this->Channel_model->get(array('id' => $id, 'status' => 1))) {
        
            $url = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=".$channel->youtube_id."&maxResults=1&key=AIzaSyCkoszshUaUgV-2CrviQI0I4pTkd8j61gc";
            $json = file_get_contents($url);
            $jsonOutput = json_decode($json);

            $limit = $jsonOutput->pageInfo->resultsPerPage;
            $total = $jsonOutput->pageInfo->totalResults;

            $totalPages = ceil($total / $limit);

            $counter = 0;

            for ( $page_number = 1; $page_number < $totalPages; $page_number++) { // Paginate

                if ($page_number > 1) {
                    $url = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=".$channel->youtube_id."&pageToken=".$token."&maxResults=50&key=AIzaSyCkoszshUaUgV-2CrviQI0I4pTkd8j61gc";
                } else {
                    $url = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=".$channel->youtube_id."&maxResults=50&key=AIzaSyCkoszshUaUgV-2CrviQI0I4pTkd8j61gc";
                }

                $json = file_get_contents($url);
                $jsonOutput = json_decode($json);

                $result = '<p>'.$channel->title.' is up to date!</p>';

                for ( $item_number = 0; $item_number < count($jsonOutput->items); $item_number++ ){

                    if (isset($jsonOutput->items[$item_number]->id->videoId) && $this->Trak_model->is_new($jsonOutput->items[$item_number]->id->videoId) ) {

                        $title = $jsonOutput->items[$item_number]->snippet->title;
                        $slug = url_title($title, '-', TRUE);
                        $youtube_id = $jsonOutput->items[$item_number]->id->videoId;
                        $published = $jsonOutput->items[$item_number]->snippet->publishedAt;
                        $current_time = date('Y-m-d H:i:s');

                        $data = array(
                            'title' => $title,
                            'slug' => $slug,
                            'youtube_id' => $youtube_id,            
                            'channel_id' => $id,
                            'color_sample' => $this->Trak_model->sample_color($youtube_id),
                            'published' => $published,
                            'created' => date('Y-m-d H:i:s'),
                            'updated' => date('Y-m-d H:i:s')
                        );

                        if (!$this->Trak_model->create($data)) {
                            $result = '<p>Error at '.$title.'</p>';
                            break 2;
                        }

                        $counter++;

                        $result = '<p>'.$counter . ' new traks added to '.$channel->title.'!</p>';

                    }

                }

                if (isset($jsonOutput->nextPageToken)) {

                    $token = $jsonOutput->nextPageToken;

                } else {

                    break 1;

                }

            }

            $this->load->helper('file');
            delete_files('assets/uploads', TRUE);
            $this->Channel_model->update($id, array('updated' => date('Y-m-d H:i:s')));

            echo $result;

        } else {
            print('Channel not found or inactive');
        }
    }

    public function activate($id) {
        if ($this->User_model->is_admin()) {

            $data = array(
                'status' => 1,
                'updated' => date('Y-m-d H:i:s')
            );

            if ($this->Channel_model->update($id, $data)) {
                redirect('dashboard', 'refresh');
            }
        }
    }

    public function deactivate($id) {
        if ($this->User_model->is_admin()) {

            $data = array(
                'status' => 0,
                'updated' => date('Y-m-d H:i:s')
            );

            if ($this->Channel_model->update($id, $data)) {
                redirect('dashboard', 'refresh');
            }
        }
    }

    public function delete($id) {

        if ($this->User_model->is_admin()) {

            if ($this->Channel_model->delete($id)) {
                redirect('dashboard', 'refresh');
            }

        }
    }

}