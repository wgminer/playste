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
            $this->db->join('users', 'users.id = songs.userId ');
            $this->db->select('songs.id, songs.title, songs.image, songs.url, songs.source, songs.sourceId, songs.playlistId, songs.sortOrder, songs.created, songs.updated, users.name');
        }

        if ($table == 'users') {
            $this->db->select('id, name, email, created, updated');
        }

        $query = $this->db->get($table);

        if ($query->num_rows() == 1) {

            $row = $query->row();

            if (isset($row->created)) {
                $row->created = date(DATE_ISO8601, strtotime($row->created));
            }

            if (isset($row->updated)) {
                $row->updated = date(DATE_ISO8601, strtotime($row->updated));
            }

            return $row;
        
        } else if ($query->num_rows() > 1) {

            foreach ($query->result() as $row) {

                if (isset($row->created)) {
                    $row->created = date(DATE_ISO8601, strtotime($row->created));
                }

                if (isset($row->updated)) {
                    $row->updated = date(DATE_ISO8601, strtotime($row->updated));
                }

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

    public function delete($table, $match) {

        $this->db->where($match);
        $this->db->delete($table); 

        if ($this->db->affected_rows() > 0) {

            return true;
        
        }

    }

}