<?php

class Trak_model extends CI_Model {

    public function create($data) {

        $this->db->insert('traks', $data);

        if ($this->db->affected_rows() > 0) {

            return $this->db->insert_id();

        } else {

            return false;
        
        }
    }

    public function get($array, $offset, $order) {

        $this->load->helper('date');

        $this->db->select('id, title, slug, youtube_id, channel_id, color_sample, published');
        $this->db->where($array);
        $this->db->order_by('published', $order);
        $this->db->limit('50', $offset);

        $query = $this->db->get('traks');

        if ($query->num_rows() == 1) {

            $row = $query->row();
            $channel = $this->Channel_model->get(array('id' => $row->channel_id));

            $row->channel_title = $channel->title;
            $row->channel_slug = $channel->slug;

            if ($this->User_model->is_authed() && $this->Favorite_model->is_favorited(array('user_id' => $this->session->userdata('id'), 'trak_id' => $row->id))) {
                $row->favorited = 'true';
            }

            $row->published = date(DATE_ISO8601, strtotime($row->published));

            return $row;
        
        } else if ($query->num_rows() > 1) {

            foreach ($query->result() as $row) {

                $channel = $this->Channel_model->get(array('id' => $row->channel_id));

                $row->channel_title = $channel->title;
                $row->channel_slug = $channel->slug;

                if ($this->User_model->is_authed() && $this->Favorite_model->is_favorited(array('user_id' => $this->session->userdata('id'), 'trak_id' => $row->id))) {
                    $row->favorited = 'true';
                }

                $row->published = date(DATE_ISO8601, strtotime($row->published));

                $data[] = $row;

            }

            return $data;

        } else {
            return false;
        }
    }

    public function get_channel_traks($channel_id) {

        $this->db->select('id, title, slug, youtube_id, channel_id, color_sample, status, published');
        $this->db->where('channel_id', $channel_id);
        $this->db->order_by('published', 'DESC');
        $query = $this->db->get('traks');

        if ($query->num_rows() == 1) {

            $row = $query->row();

            return $row;
        
        } else if ($query->num_rows() > 1) {

            foreach ($query->result() as $row) {

                $data[] = $row;

            }

            return $data;

        }
    }

    public function search($query, $offset) {

        $this->load->helper('date');

        $this->db->select('id, title, slug, youtube_id, channel_id, color_sample, published');
        $this->db->like('title', $query, 'both');
        $this->db->order_by('published', 'DESC');
        $this->db->limit('50', $offset);

        $query = $this->db->get('traks');

        if ($query->num_rows() == 1) {

            $row = $query->row();
            $channel = $this->Channel_model->get(array('id' => $row->channel_id));

            $row->channel_title = $channel->title;
            $row->channel_slug = $channel->slug;

            $row->published = date(DATE_ISO8601, strtotime($row->published));

            return $row;
        
        } else if ($query->num_rows() > 1) {

            foreach ($query->result() as $row) {

                $channel = $this->Channel_model->get(array('id' => $row->channel_id));

                $row->channel_title = $channel->title;
                $row->channel_slug = $channel->slug;

                $row->published = date(DATE_ISO8601, strtotime($row->published));

                $data[] = $row;

            }

            return $data;

        } else {
            return false;
        }
    }

    public function update($id, $data) {

        $this->db->where('id', $id);
        $this->db->update('traks', $data);

        if ($this->db->affected_rows() > 0) {
            return true;
        }
    } 

    public function is_new($youtube_id) {

        $this->db->where('youtube_id', $youtube_id);
        $query = $this->db->get('traks');

        if ($query->num_rows() == 0){
            return true;
        }
    }

    public function delete($id) {

        $this->db->where('id', $id);
        $this->db->delete('traks'); 

        if ($this->db->affected_rows() > 0) {
            return true;
        }
    }

    public function sample_color($youtube_id) {

        $this->load->library('colorthief');

        $img_url = 'http://img.youtube.com/vi/'.$youtube_id.'/default.jpg';
        $upload_path = 'assets/uploads/'.$youtube_id.'.jpg';

        copy($img_url, $upload_path); // Copy file

        $this->load->library('colorthief');
        $rgb = colorthief::getColor($upload_path, 8); // Get color

        $hex = "#";
        $hex .= str_pad(dechex($rgb[0]), 2, '0', STR_PAD_LEFT);
        $hex .= str_pad(dechex($rgb[1]), 2, '0', STR_PAD_LEFT);
        $hex .= str_pad(dechex($rgb[2]), 2, '0', STR_PAD_LEFT);

        return $hex;

    }

    public function count($id) {
        $this->db->where('channel_id', $id);
        $query = $this->db->get('traks');
        
        return $query->num_rows();
    }

}

?>