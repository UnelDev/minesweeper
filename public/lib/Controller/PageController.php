<?php
namespace OCA\Minesweeper\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\ContentSecurityPolicy;

class PageController extends Controller {
	public function __construct($AppName, IRequest $request){
		parent::__construct($AppName, $request);
	}

	/**
	 * CAUTION: the @Stuff turns off security checks; for this page no admin is
	 *          required and no CSRF check. If you don't know what CSRF is, read
	 *          it up in the docs or you might create a security hole. This is
	 *          basically the only required method to add this exemption, don't
	 *          add it to any other method if you don't exactly know what it does
	 *
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function index() {
		$response = new TemplateResponse('minesweeper', 'index');
		$csp = new ContentSecurityPolicy();
		$csp->useStrictDynamicOnScripts(true);
		$response->setContentSecurityPolicy($csp);

		return $response;
	}

}