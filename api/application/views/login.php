<?php $this->load->view('includes/head'); ?>

	<div style="margin-top:80px;" class="container">
		<div class="row">
			<div class="col-sm-4 col-sm-offset-4">

				<?php echo form_open('admin/login'); ?>

					<div class="form-group">
			            <label for="email">Email</label>
			            <input class="form-control" name="email" type="email" placeholder="Email">
			        </div>
					
					<div class="form-group">
			            <label for="password">Password</label>
			            <input class="form-control" name="password" type="password" placeholder="Password">
			        </div>

					<div class="pure-controls">
						<input class="btn btn-default" type="submit" value="Login">
					</div>

				<?php echo form_close(); ?>			

			</div>
		</div>
	</div>

<?php $this->load->view('includes/footer'); ?>