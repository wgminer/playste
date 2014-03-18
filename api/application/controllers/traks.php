<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Traks extends CI_Controller {

    public function index() {

        if (!isset($_GET['channel']) && !isset($_GET['q'])) { // GET EVERYTHING

            if (isset($_GET['order'])) {
                
                $order = $_GET['order'];

            } else {

                $order = 'DESC';

            }

            if (isset($_GET['offset'])) {
                
                $offset = $_GET['offset'];

            } else {

                $offset = 0;

            }

            $data = $this->Trak_model->get(array('id >' => 0, 'status' => 1), $offset, $order);

            echo json_encode($data);

        } else if (isset($_GET['channel'])  && !isset($_GET['q'])) { // GET CHANNEL

            if (isset($_GET['order'])) {
                
                $order = $_GET['order'];

            } else {

                $order = 'DESC';

            }

            if (isset($_GET['offset'])) {
                
                $offset = $_GET['offset'];

            } else {

                $offset = 0;

            }

            $id = $_GET['channel'];

            if (is_numeric($id)) {
            
                $data = $this->Trak_model->get(array('channel_id' => $id, 'status' => 1), $offset, $order);
            
            } else {

                $channel = $this->Channel_model->get(array('slug' => $id));
                $data = $this->Trak_model->get(array('channel_id' => $channel->id, 'status' => 1), $offset, $order);

            }

            echo json_encode($data);

        } else if (isset($_GET['favorites'])  && !isset($_GET['q'])) { // GET FAVORITES

            if (isset($_GET['order'])) {
                
                $order = $_GET['order'];

            } else {

                $order = 'DESC';

            }

            if (isset($_GET['offset'])) {
                
                $offset = $_GET['offset'];

            } else {

                $offset = 0;

            }

            $id = $_GET['channel'];

            if (is_numeric($id)) {
            
                $data = $this->Trak_model->get(array('channel_id' => $id, 'status' => 1), $offset, $order);
            
            } else {

                $channel = $this->Channel_model->get(array('slug' => $id));
                $data = $this->Trak_model->get(array('channel_id' => $channel->id, 'status' => 1), $offset, $order);

            }

            echo json_encode($data);

        } else if (isset($_GET['order']) && $_GET['order'] == 'latest' && !isset($_GET['channel'])  && isset($_GET['q'])) { // GET SEARCH

            if (isset($_GET['offset'])) {
                
                $offset = $_GET['offset'];

            } else {

                $offset = 0;

            }

            $query = $_GET['q'];

            if ($data = $this->Trak_model->search($query, $offset)) {

                echo json_encode($data);

            } else {
                header('HTTP', TRUE, 404);
            }

        } else {

            echo 'Welcome to the Channeltrak API';

        }

    }

	public function get($id) {

        if (is_numeric($id)) {

            $trak = $this->Trak_model->get(array('id' => $id), 0, 'DESC');

        } else if ($id == 'random') {

            $trak = $this->Trak_model->random();

        } else {

            $trak = $this->Trak_model->get(array('slug' => $id), 0, 'DESC');

        }

    	echo json_encode($trak);

    }

    public function activate($id) {
        if ($this->User_model->is_admin()) {

            $trak = $this->Trak_model->get(array('id' => $id), 0, 'DESC');

            $data = array(
                'status' => 1,
                'updated' => date('Y-m-d H:i:s')
            );

            if ($this->Trak_model->update($id, $data)) {
                redirect('admin/channel/'.$trak->channel_id);
            }

        }
    }

    public function deactivate($id) {
        if ($this->User_model->is_admin()) {

            $trak = $this->Trak_model->get(array('id' => $id), 0, 'DESC');

            $data = array(
                'status' => 0,
                'updated' => date('Y-m-d H:i:s')
            );

            if ($this->Trak_model->update($id, $data)) {
                redirect('admin/channel/'.$trak->channel_id);
            }
        }
    }

    public function delete($id) {

        if ($this->User_model->is_admin()) {

            $trak = $this->Trak_model->get(array('id' => $id), 0, 'DESC');

            if ($this->Trak_model->delete($id)) {
                redirect('admin/channel/'.$trak->channel_id);
            }

        }

    }

    public function sample_color($youtube_id) {

        echo json_encode($this->Trak_model->sample_color($youtube_id));

    }

}