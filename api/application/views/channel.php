<?php $this->load->view('includes/head'); ?>
<?php $this->load->view('includes/nav'); ?>

<section id="channel">

	<div class="container">
		<div class="row">
			<div class="col-md-12">
				<h1 class="page-header"><?php echo $channel->title; ?></h1>
			</div>
		</div>
		<div class="row" style="margin-bottom: 40px;">
		
			<div class="col-md-4">
				<img src="http://img.youtube.com/vi/<?php echo $channel->cover_id; ?>/hqdefault.jpg" class="img-responsive">
			</div>

			<div class="col-md-4">
				<?php echo form_open('channels/update/'.$channel->id); ?>
					<div class="form-group">
				    	<label for="cover_id">Title</label>
					    <input type="text" name="title" class="form-control" value="<?php echo $channel->title; ?>">
				  	</div>
				  	<div class="form-group">
				    	<label for="cover_id">Cover ID</label>
					    <input type="text" name="cover_id" class="form-control" value="<?php echo $channel->cover_id; ?>">
				  	</div>
				    <button type="submit" class="btn btn-default">Update</button>
				<?php echo form_close(); ?>	
			</div>

			<div class="col-md-4">
				<label for="">Published</label>
				<p><?php echo date('M j g:i a T', strtotime($channel->published)); ?></p>
				<label for="">Created</label>
				<p><?php echo date('M j g:i a T', strtotime($channel->created)); ?></p>
				<label for="">Updated</label>
				<p><?php echo date('M j g:i a T', strtotime($channel->updated)); ?></p>
			</div>

		</div>
		<div class="row">

			<div class="col-md-12">
				
				<table class="table table-bordered">

					<thead>
						<tr>
							<th>#</th>
							<th width="10%">Image</th>
							<th>Title</th>
							<th>Published</th>
						</tr>
					</thead>
					
					<tbody>
					<?php if(isset($traks)) : ?>
					<?php foreach ($traks as $trak) : ?>

						<tr>
							<td><?php echo $trak->id ?></td>
							<td>
								<div style="padding: 12px; background-color: <?php echo $trak->color_sample; ?>">
									<img class="img-responsive" src="http://img.youtube.com/vi/<?php echo $trak->youtube_id; ?>/default.jpg">
								</div>
							</td>
							<td>
								<p><a href="http://dev.channeltrak.com/#/trak/<?php echo $trak->slug; ?>" target="_blank" title="<?php echo $trak->title ?>"><?php echo $trak->title; ?></a></p>
								<div>
									<?php if ($trak->status == 1) : ?>
									<a href="<?php echo base_url(); ?>traks/deactivate/<?php echo $trak->id; ?>" class="btn btn-success btn-sm">Active</a>
									<?php else : ?>
									<a href="<?php echo base_url(); ?>traks/activate/<?php echo $trak->id; ?>" class="btn btn-warning btn-sm">Inactive</a>
									<?php endif; ?>
									<a href="<?php echo base_url(); ?>traks/delete/<?php echo $trak->id; ?>" class="btn btn-danger btn-sm">Delete</a>
								</div>
							</td>
							<td><?php echo date('M j Y g:i a T', strtotime($trak->published)); ?></td>
						</tr>
					
					<?php endforeach; ?>
					<?php endif; ?>
					</tbody>
			
				</table>

				<div class="well">
					<a class="btn btn-danger btn-block" href="<?php echo base_url(); ?>channel/delete/<?php echo $channel->id ?>">DELETE EVERYTHING!</a>
				</div>

			</div>

		</div>
	</div>

</section>

<?php $this->load->view('includes/footer'); ?>
