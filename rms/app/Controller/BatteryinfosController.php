<?php
/**
 * Batteryinfos Settings Controller
 *
 * A Batteryinfos contains information about the ArNerworking/Batteryinfo topic and optional throttle rate.
 *
 * @author		Russell Toris - rctoris@wpi.edu
 * @copyright	2014 Worcester Polytechnic Institute
 * @link		https://github.com/WPI-RAIL/rms
 * @since		RMS v 2.0.0
 * @version		2.0.2
 * @package		app.Controller
 */
class BatteryinfosController extends AppController {

/**
 * The used helpers for the controller.
 *
 * @var array
 */
	public $helpers = array('Html', 'Form');

/**
 * The used components for the controller.
 *
 * @var array
 */
	public $components = array('Session', 'Auth' => array('authorize' => 'Controller'));

/**
 * The admin index action redirects to the main widget index.
 *
 * @return null
 */
	public function admin_index() {
		return $this->redirect(array('controller' => 'widget', 'action' => 'index', '#' => 'Batteryinfos'));
	}

/**
 * The admin add action. This will allow the admin to create a new entry.
 *
 * @return null
 */
	public function admin_add() {
		// load the environments list
		$environments = $this->Batteryinfo->Environment->find('list');
		$this->set('environments', $environments);

		// only work for POST requests
		if ($this->request->is('post')) {
			// create a new entry
			$this->Batteryinfo->create();
			// check for empty values
			if (strlen($this->request->data['Batteryinfo']['throttle']) === 0) {
				$this->request->data['Batteryinfo']['throttle'] = null;
			}
			// set the current timestamp for creation and modification
			$this->Batteryinfo->data['Batteryinfo']['created'] = date('Y-m-d H:i:s');
			$this->Batteryinfo->data['Batteryinfo']['modified'] = date('Y-m-d H:i:s');
			// attempt to save the entry
			if ($this->Batteryinfo->save($this->request->data)) {
				$this->Session->setFlash('The Batteryinfo has been saved.');
				return $this->redirect(array('action' => 'index'));
			}
			$this->Session->setFlash('Unable to add the Batteryinfo.');
		}

		$this->set('title_for_layout', 'Add Batteryinfo');
	}

/**
 * The admin edit action. This allows the admin to edit an existing entry.
 *
 * @param int $id The ID of the entry to edit.
 * @throws NotFoundException Thrown if an entry with the given ID is not found.
 * @return null
 */
	public function admin_edit($id = null) {
		// load the environments list
		$environments = $this->Batteryinfo->Environment->find('list');
		$this->set('environments', $environments);

		if (!$id) {
			// no ID provided
			throw new NotFoundException('Invalid Batteryinfo.');
		}

		$Batteryinfo = $this->Batteryinfo->findById($id);
		if (!$Batteryinfo) {
			// no valid entry found for the given ID
			throw new NotFoundException('Invalid Batteryinfo.');
		}

		// only work for PUT requests
		if ($this->request->is(array('Batteryinfo', 'put'))) {
			// set the ID
			$this->Batteryinfo->id = $id;
			// check for empty values
			if (strlen($this->request->data['Batteryinfo']['throttle']) === 0) {
				$this->request->data['Batteryinfo']['throttle'] = null;
			}
			// set the current timestamp for modification
			$this->Batteryinfo->data['Batteryinfo']['modified'] = date('Y-m-d H:i:s');
			// attempt to save the entry
			if ($this->Batteryinfo->save($this->request->data)) {
				$this->Session->setFlash('The Batteryinfo has been updated.');
				return $this->redirect(array('action' => 'index'));
			}
			$this->Session->setFlash('Unable to update the Batteryinfo.');
		}

		// store the entry data if it was not a PUT request
		if (!$this->request->data) {
			$this->request->data = $Batteryinfo;
		}

		$this->set('title_for_layout', __('Edit Batteryinfo - %s', $Batteryinfo['Batteryinfo']['topic']));
	}

/**
 * The admin delete action. This allows the admin to delete an existing entry.
 *
 * @param int $id The ID of the entry to delete.
 * @throws MethodNotAllowedException Thrown if a GET request is made.
 * @return null
 */
	public function admin_delete($id = null) {
		// do not allow GET requests
		if ($this->request->is('get')) {
			throw new MethodNotAllowedException();
		}

		// attempt to delete the entry
		if ($this->Batteryinfo->delete($id)) {
			$this->Session->setFlash('The Batteryinfo has been deleted.');
			return $this->redirect(array('action' => 'index'));
		}
	}
}
