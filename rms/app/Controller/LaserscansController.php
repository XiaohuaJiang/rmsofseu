<?php
/**
 * Laserscan Settings Controller
 *
 * A laserscan contains information about the ROS 3D laserscan topic.
 *
 * @author		Russell Toris - rctoris@wpi.edu
 * @copyright	2014 Worcester Polytechnic Institute
 * @link		https://github.com/WPI-RAIL/rms
 * @since		RMS v 2.0.0
 * @version		2.0.5
 * @package		app.Controller
 */
class LaserscansController extends AppController {

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
		return $this->redirect(array('controller' => 'widget', 'action' => 'index', '#' => 'laserscans'));
	}

/**
 * The admin add action. This will allow the admin to create a new entry.
 *
 * @return null
 */
	public function admin_add() {
		// load the environments list
		$environments = $this->Laserscan->Environment->find('list');
		$this->set('environments', $environments);

		// only work for POST requests
		if ($this->request->is('post')) {
			// create a new entry
			$this->Laserscan->create();
			// set the current timestamp for creation and modification
			$this->Laserscan->data['Laserscan']['created'] = date('Y-m-d H:i:s');
			$this->Laserscan->data['Laserscan']['modified'] = date('Y-m-d H:i:s');
			// attempt to save the entry
			if ($this->Laserscan->save($this->request->data)) {
				$this->Session->setFlash('The laserscan has been saved.');
				return $this->redirect(array('action' => 'index'));
			}
			$this->Session->setFlash('Unable to add the laserscan.');
		}

		$this->set('title_for_layout', 'Add Laserscan');
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
		$environments = $this->Laserscan->Environment->find('list');
		$this->set('environments', $environments);

		if (!$id) {
			// no ID provided
			throw new NotFoundException('Invalid laserscan.');
		}

		$laserscan = $this->Laserscan->findById($id);
		if (!$laserscan) {
			// no valid entry found for the given ID
			throw new NotFoundException('Invalid laserscan.');
		}

		// only work for PUT requests
		if ($this->request->is(array('laserscan', 'put'))) {
			// set the ID
			$this->Laserscan->id = $id;
			// check for empty values
			if (strlen($this->request->data['Laserscan']['throttle']) === 0) {
				$this->request->data['Laserscan']['throttle'] = null;
			}
			// set the current timestamp for modification
			$this->Laserscan->data['Laserscan']['modified'] = date('Y-m-d H:i:s');
			// attempt to save the entry
			if ($this->Laserscan->save($this->request->data)) {
				$this->Session->setFlash('The laserscan has been updated.');
				return $this->redirect(array('action' => 'index'));
			}
			$this->Session->setFlash('Unable to update the laserscan.');
		}

		// store the entry data if it was not a PUT request
		if (!$this->request->data) {
			$this->request->data = $laserscan;
		}

		$this->set('title_for_layout', __('Edit Laserscan - %s', $laserscan['Laserscan']['topic']));
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
		if ($this->Laserscan->delete($id)) {
			$this->Session->setFlash('The laserscan has been deleted.');
			return $this->redirect(array('action' => 'index'));
		}
	}

/**
 * View the given entry.
 *
 * @param int $id The ID of the entry to view.
 * @throws NotFoundException Thrown if an entry with the given ID is not found.
 * @return null
 */
	public function admin_view($id = null) {
		if (!$id) {
			// no ID provided
			throw new NotFoundException('Invalid laserscan.');
		}

		$this->Laserscan->recursive = 3;
		$laserscan = $this->Laserscan->findById($id);
		if (!$laserscan) {
			// no valid entry found for the given ID
			throw new NotFoundException('Invalid laserscan.');
		}

		// store the entry
		$this->set('laserscan', $laserscan);
		$this->set('title_for_layout', $laserscan['Laserscan']['topic']);
		// we will need some RWT libraries
		$this->set('rwt', array('roslibjs' => 'current', 'ros3djs' => 'current'));
	}
}
