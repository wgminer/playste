<?php

class Playlist_model extends CI_Model {

	public function generate_hash() {
    	
    	$length = 5;
		$charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		do {
			$hash = substr(str_shuffle(str_repeat($charset, $length)), 0, $length);
			$this->db->where('hash', $hash);
			$query = $this->db->get('playlists');
		} while($query->num_rows() > 0);

		return $hash;

	}

	public function getPlaylists($match) {

        $this->db->where($match);
        $this->db->join('playlists', 'playlists.id = playlist_users.playlistId');
        $this->db->join('users', 'users.id = playlist_users.userId ');

        $this->db->select('playlists.id, playlists.hash, users.name, playlists.created, playlists.updated, playlist_users.userRole');

        $query = $this->db->get('playlist_users');

        if ($query->num_rows() == 1) {

            $row = $query->row();

            if ($row->created) {
                $row->created = date(DATE_ISO8601, strtotime($row->created));
            }

            if ($row->updated) {
                $row->updated = date(DATE_ISO8601, strtotime($row->updated));
            }

            return $row;
        
        } else if ($query->num_rows() > 1) {

            foreach ($query->result() as $row) {
                if ($row->created) {
                    $row->created = date(DATE_ISO8601, strtotime($row->created));
                }

                if ($row->updated) {
                    $row->updated = date(DATE_ISO8601, strtotime($row->updated));
                }
            
                $data[] = $row;
            }

            return $data;

        } else {
            return false;
        }

    }

}

