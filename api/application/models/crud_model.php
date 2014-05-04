<?php

class CRUD_model extends CI_Model {

    public function create($table, $data) {

        $this->db->insert($table, $data);

        if ($this->db->affected_rows() > 0) {
            return $this->db->insert_id();
        } else {
            return false;
        }
    } 

    public function get($table, $match) {

        $this->db->where($match);

        if ($table == 'songs') {
            $this->db->order_by('sortOrder', 'ASC');
        }

        $query = $this->db->get($table);

        if ($query->num_rows() == 1) {

            return $query->row();
        
        } else if ($query->num_rows() > 1) {

            foreach ($query->result() as $row) {
                $data[] = $row;
            }

            return $data;

        } else {
            return false;
        }

    }

    public function update($table, $match, $data) {

        $this->db->where($match);
        $this->db->update($table, $data);

        if ($this->db->affected_rows() > 0) {
            return true;
        }
    } 

    public function delete($table, $id) {

        $this->db->where('channel_id', $id);
        $this->db->delete($table); 

        if ($this->db->affected_rows() > 0) {

            return true;
        
        }

    }

}