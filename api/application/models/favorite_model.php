<?php

class Favorite_model extends CI_Model {

    public function create($data) {

        $this->db->insert('favorites', $data);

        if ($this->db->affected_rows() > 0) {

            return $this->db->insert_id();

        } else {

            return false;
        
        }
    } 

    public function is_favorited($array) {

        $this->db->where($array);
        $query = $this->db->get('favorites');

        if ($query->num_rows() == 1) {
            return true;
        } else {
            return false;
        }

    }

    public function get($user_id, $offset, $order) {

        $this->db->select('*');
        $this->db->from('traks');
        $this->db->join('favorites', 'favorites.trak_id = traks.id', 'right');
        $this->db->where('favorites.user_id', $user_id);

        $this->db->limit('50', $offset);
        $this->db->order_by('favorites.created', 'DESC');

        $query = $this->db->get();

        if ($query->num_rows() == 1) {

            $row = $query->row();
            $channel = $this->Channel_model->get(array('id' => $row->channel_id));

            $row->channel_title = $channel->title;
            $row->channel_slug = $channel->slug;
            $row->favorited = 'true';

            $row->published = date(DATE_ISO8601, strtotime($row->published));
            $row->created = date(DATE_ISO8601, strtotime($row->created));

            return $row;
        
        } else if ($query->num_rows() > 1) {

            foreach ($query->result() as $row) {

                $channel = $this->Channel_model->get(array('id' => $row->channel_id));

                $row->channel_title = $channel->title;
                $row->channel_slug = $channel->slug;
                $row->favorited = 'true';

                $row->published = date(DATE_ISO8601, strtotime($row->published));
                $row->created = date(DATE_ISO8601, strtotime($row->created));

                $data[] = $row;

            }

            return $data;

        } else if (!$query) {
            return false;
        }
    }

    public function delete($array) {
        
        $this->db->where($array);
        $this->db->delete('favorites'); 

        if ($this->db->affected_rows() > 0) {
            return true;
        }
    }

}

?>