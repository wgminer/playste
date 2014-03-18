<?php

class Channel_model extends CI_Model {

    public function create($data) {

        $this->db->insert('channels', $data);

        if ($this->db->affected_rows() > 0) {

            return $this->db->insert_id();

        } else {

            return false;
        
        }
    } 

    public function get($array) {

        $this->db->where($array);

        $query = $this->db->get('channels');

        if ($query->num_rows() == 1) {

            $row = $query->row();

            $row->count = $this->Trak_model->count($row->id);

            return $row;
        
        } else if ($query->num_rows() > 1) {

            foreach ($query->result() as $row) {

                $row->count = $this->Trak_model->count($row->id);

                $data[] = $row;

            }

            return $data;

        } else {

            return false;

        }

    }

    public function update($id, $data) {

        $this->db->where('id', $id);
        $this->db->update('channels', $data);

        if ($this->db->affected_rows() > 0) {

            return true;
        
        }
    } 

    public function delete($id) {

        $this->db->where('channel_id', $id);
        $this->db->delete('channels'); 

        if ($this->db->affected_rows() > 0) {

            return true;
        
        }

    }

}

?>