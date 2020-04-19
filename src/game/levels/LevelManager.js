import { subscribe, dispatch, types } from '../state';
import { game } from '../../game';
import { Level1 } from './Level1';
import { Level2 } from './Level2';
import { StageComplete } from './StageComplete';
import { Pause } from './Pause';

const scenes = {
    LEVEL1: {
        title: 'Level 1',
        key: 'Level1',
        scene: new Level1(),
    },
    LEVEL2: {
        title: 'Level 2',
        key: 'Level2',
        scene: new Level2(),
    },
    LEVEL3: {
        title: 'Level 3',
        key: 'Level3',
        scene: new Level1(),
    },
    LEVEL4: {
        title: 'Level 4',
        key: 'Level4',
        scene: new Level1(),
    },
    LEVEL5: {
        title: 'Level 5',
        key: 'Level5',
        scene: new Level1(),
    },
    STAGE_COMPLETE: {
        title: 'Stage complete',
        key: 'StageComplete',
        scene: new StageComplete(),
    },
    PAUSE: {
        title: 'Pause',
        key: 'Pause',
        scene: new Pause(),
    },
};

export const levels = [
    scenes.LEVEL1,
    scenes.LEVEL2,
    scenes.LEVEL3,
    scenes.LEVEL4,
    scenes.LEVEL5,
    // scenes.LEVEL6,
    // scenes.LEVEL7,
    // scenes.LEVEL8,
    // scenes.LEVEL9,
    // scenes.LEVEL10
];

export const getLevelByKey = key => levels.find(l => l.key === key);

let currentLevel = undefined;

const handleLevelChange = state => {
    if (state.level !== currentLevel) {
        if (currentLevel !== undefined) {
            let old = getLevelByKey(currentLevel);
            old.scene.scene.stop();
            if (state.showTransition) {
                game.scene.start(scenes.STAGE_COMPLETE.key, {
                    level: old.title,
                    transitionTo: state.level,
                });
            } else {
                game.scene.start(state.level);
            }
        } else {
            game.scene.start(state.level);
        }
        currentLevel = state.level;
    }
};

const handlePause = state => {
    let current = getLevelByKey(state.level);
    if (current && current.scene && current.scene.scene) {
        if (state.paused) {
            current.scene.scene.pause();
            game.scene.start(scenes.PAUSE.key);
            game.scene.bringToTop(scenes.PAUSE.key);
        } else {
            current.scene.scene.resume();
            game.scene.stop(scenes.PAUSE.key);
            game.scene.sendToBack(scenes.PAUSE.key);
        }
    }
};

const handleZoom = state => {
    let current = getLevelByKey(state.level);
    if (current && current.scene && current.scene.cameras) {
        current.scene.cameras.main.setZoom(state.zoom);
        if (current.scene.background) {
            current.scene.background.setDisplaySize(
                (1 / state.zoom) * current.scene.cameras.main.width,
                (1 / state.zoom) * current.scene.cameras.main.height
            );
        }
    }
};

export const init = () => {
    Object.keys(scenes).forEach(k =>
        game.scene.add(scenes[k].key, scenes[k].scene)
    );
    subscribe(handleLevelChange);
    subscribe(handlePause);
    subscribe(handleZoom);
};

export const restartCurrentLevel = () => {
    let current = getLevelByKey(currentLevel);
    if (current && current.scene && current.scene.scene) {
        current.scene.scene.stop();
        current.scene.scene.start();
        setTimeout(() => {
            dispatch({ type: 'BUMP' }); // force zoom to update
        }, 0);
    }
};

export const advanceToNextLevel = () => {
    const nextIndex = !currentLevel
        ? 0
        : levels.findIndex(l => l.key === currentLevel) + 1;
    if (!levels[nextIndex]) throw new Error('Next level does not exist');
    dispatch({
        type: types.SET_LEVEL,
        level: levels[nextIndex].key,
        showTransition: true,
    });
};
