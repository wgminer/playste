<?php

class User_model extends CI_Model {

    public function create($data) {

        $this->db->insert('users', $data);

        if ($this->db->affected_rows() > 0) {
            return $this->db->insert_id();
        } else {
            return false;
        }
    } 

    public function get($array) {

        $this->db->select('id, email, permissions, created, updated');
        $this->db->where($array);
        $query = $this->db->get('users'); 

        if ($query->num_rows() > 1) {

            foreach ($query->result() as $row) {
                $data[] = $row;
            }

            return $data;

        } else {

            $row = $query->row();

            return $row;

        }
        
    }

    public function update($id, $data) {

        $this->db->where('id', $id);
        $this->db->update('users', $data);

        if ($this->db->affected_rows() > 0) {
            return true;
        }
    } 

    public function delete($id) {

        $this->db->where('id', $id);
        $this->db->delete('mytable');

        if ($this->db->affected_rows() > 0) {
            return true;
        }
    }

    public function auth($email, $password) {

        $this->db->where('email', $email);
        $this->db->where('password', $password);

        $query = $this->db->get('users');

        if ($query->num_rows() == 1) {

            $row = $query->row();

            $cookie = array(
                'id' => $row->id,
                'email' => $row->email,
                'logged_in' => true
            );

            $this->session->set_userdata($cookie);

            return $cookie;

        } else {

            return false;

        }

    }

    public function is_authed() {
        
        if ($this->session->userdata('logged_in')) {

            return true;
        
        } else {
        
            return false;
        
        }
    }

    public function is_admin() {
        
        if ($this->session->userdata('logged_in')) {

            $id = $this->session->userdata('id');

            if ($this->User_model->get(array('id' => $id, 'permissions' => 1))) {

                return true;

            } else {

                return false;

            }
        
        } else {
        
            return false;
        
        }
    }

}

?>