<?php $this->load->view('includes/head'); ?>
<?php $this->load->view('includes/nav'); ?>

<section id="dashboard">

	<div class="container">
		<div class="row">
			<div class="col-md-12">
				<h1 class="page-header">Dashboard</h1>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12">
				<table class="table table-bordered">
					<thead>
						<tr>
							<th>#</th>
							<th>Title</th>
							<th>Count</th>
							<th>Updated</th>
							<th>Status</th>
							<th>Import</th>
						</tr>					
					</thead>
					<tbody>
						<?php foreach ($channels as $channel) : ?>
						<tr>
							<td><?php echo $channel->id; ?></td>
							<td><a href="<?php echo base_url(); ?>admin/channel/<?php echo $channel->id; ?>"><?php echo $channel->title; ?></a></td>
							<td><?php echo $channel->count; ?></td>
							<td><?php echo date('M j g:i a T', strtotime($channel->updated)); ?></td>
							<td>
								<?php if ($channel->status == 1) : ?>
								<a href="<?php echo base_url(); ?>channels/deactivate/<?php echo $channel->id; ?>" class="btn btn-success btn-sm btn-block">Active</a>
								<?php else : ?>
								<a href="<?php echo base_url(); ?>channels/activate/<?php echo $channel->id; ?>" class="btn btn-warning btn-sm btn-block">Inactive</a>
								<?php endif; ?>
							</td>
							<td>
								<a href="<?php echo base_url(); ?>v2_import/<?php echo $channel->id; ?>" class="btn btn-primary btn-sm btn-block">Import</a>
							</td>
						</tr>
						<?php endforeach; ?>	
					</tbody>
				</table>				
				<a href="<?php echo base_url(); ?>v2_import/all" class="btn btn-default btn-lg btn-block">Import All</a>
			</div>
		</div>
	</div>

</section>

<?php $this->load->view('includes/footer'); ?>
