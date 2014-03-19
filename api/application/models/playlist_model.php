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

}

