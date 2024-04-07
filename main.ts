import { App, Editor, MarkdownView, ItemView, Modal, Workspace, WorkspaceLeaf, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { 
	ViewUpdate,
	PluginValue,
	EditorView,
	ViewPlugin,
	 } from '@codemirror/view';
import { syntaxTree } from "@codemirror/language";
import { codemirror } from "node_modules/codemirror"
import { showMinimap } from "@replit/codemirror-minimap";
import { ExampleView, VIEW_TYPE_EXAMPLE } from "./view";

const 
export class ObsidianO extends Plugin{
	async onload() {
		const ext = this.buildObsidianOPlugin();
		this.registerEditorExtension(ext);
	}

	buildObsidianOPlugin() {

		let create = (v: EditorView) => {
			const dom = document.createElement('div');
			return { dom }
		}

		let view = new EditorView({
			doc: "",
			extensions: [
				showMinimap.compute(['doc'], (state) => {
					return {
						create,
        /* optional */
        displayText: 'blocks',
        showOverlay: 'always',
        gutters: [ { 1: '#00FF00', 2: '#00FF00' } ],
      }
    }),
  ],
  parent: document.querySelector('#editor'),
})
	}
	constructor(
		app: App, 
		view: EditorView, 
		plugin: ObsidianO
		) {
		super(app, plugin);
		}
		this.plugin = plugin;	
	),
		toDOM(view: EditorView): HTMLElement {
			const div = document.createElement("span");
			let create = (v: EditorView) => {
				const dom = document.createElement('div');
				return { dom }
		}
	public settings: ObsidianOSettings;
	private cmExtension: Extension[ codemirror,
		showMinimap.compute(['doc'], (state) => {
		  return {
			create,
			/* optional */
			displayText: 'blocks',
			showOverlay: 'always',
			gutters: [ { 1: '#00FF00', 2: '#00FF00' } ],
	  parent: document.querySelector('#editor'),],
	})

	async onload(): Promise<void> {}
	]
}


onload () {
	console.log ('loading plugin: Minimap O');

	this.addCommand({
		id:'view-minimap',
		name: 'View Minimap',
		checkCallback: (checking: bollean) => {
			let active = this.app.workspace.aftiveLeaf;
			if (active) {
			let create = (v: EditorView) => {
				const dom = document.createElement('div');
				return { dom };
			  } 
			  new EditorView({
				doc: "",);
			let showMinimap = new EditorView;

		}
	});
	this.registerView(MINIMAP, () => new MinimapView());

}


}
async activateView() {
	const { workspace } = this.app;

	let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(MINIMAP);

    if (leaves.length > 0) {
      // A leaf with our view already exists, use that
      leaf = leaves[0];
    } else {
      // Our view could not be found in the workspace, create a new leaf
      // in the right sidebar for it
      leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({ type: MINIMAP, active: true });
    }

    // "Reveal" the leaf in case it is in a collapsed sidebar
    workspace.revealLeaf(leaf);
  }
}


}



constructor: let view = new EditorView({
	doc: "",
	extensions: [
	  showMinimap.compute(['doc'], (state) => {
		return {
		  createEl,
		  /* optional */
		  displayText: 'blocks',
		  showOverlay: 'always',
		  gutters: [ { 1: '#00FF00', 2: '#00FF00' } ],
		}
	  }),
	],
	parent: document.querySelector('#editor'),
  })



// Remember to rename these classes and interfaces!

interface ObsidianOSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: ObsidianOSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: ObsidianOSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
