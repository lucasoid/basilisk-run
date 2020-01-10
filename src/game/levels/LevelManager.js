import { subscribe } from '../state';
import { game } from '../../game';
import { Level1 } from './Level1';
import { Level2 } from './Level2';
import { StageComplete } from './StageComplete';
import { Pause } from './Pause';

export const levels = {
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

const getLevelByKey = key => {
    let LEVEL = Object.keys(levels).find(k => levels[k].key === key);
    return levels[LEVEL] || null;
};

let currentLevel = undefined;

const handleLevelChange = state => {
    if (state.level !== currentLevel) {
        if (currentLevel !== undefined) {
            let old = getLevelByKey(currentLevel);
            old.scene.scene.stop();
            game.scene.start(levels.STAGE_COMPLETE.key, {
                level: old.title,
                transitionTo: state.level,
            });
        } else {
            game.scene.start(state.level);
        }
        currentLevel = state.level;
    }
};

const handlePause = state => {
    let current = getLevelByKey(state.level);
    if (
        current &&
        current.scene &&
        current.scene.scene &&
        current.scene.scene.isPaused() !== state.paused
    ) {
        if (state.paused) {
            current.scene.scene.pause();
            game.scene.start(levels.PAUSE.key);
            game.scene.bringToTop(levels.PAUSE.key);
        } else {
            current.scene.scene.resume();
            game.scene.stop(levels.PAUSE.key);
            game.scene.sendToBack(levels.PAUSE.key);
        }
    }
};

export const init = () => {
    game.scene.add(levels.LEVEL1.key, levels.LEVEL1.scene);
    game.scene.add(levels.LEVEL2.key, levels.LEVEL2.scene);

    game.scene.add(levels.STAGE_COMPLETE.key, levels.STAGE_COMPLETE.scene);
    game.scene.add(levels.PAUSE.key, levels.PAUSE.scene);

    subscribe(handleLevelChange);
    subscribe(handlePause);
};

export const restartCurrentLevel = () => {
    let current = getLevelByKey(currentLevel);
    if (current && current.scene && current.scene.scene) {
        current.scene.scene.stop();
        current.scene.scene.start();
    }
};