class ObjectUtil {

    static copy(target, source) {
        for (const key of Object.keys(source)) {
            if (key in target) { 
                target[key] = source[key];
            }
        }        
    }

}

module.exports = ObjectUtil;