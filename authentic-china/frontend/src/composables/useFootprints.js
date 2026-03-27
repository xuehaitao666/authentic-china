import { ref, watch, onMounted } from 'vue'
import { useAuth } from './useAuth'

const history = ref([])
const favorites = ref([])

let isInitialized = false

export function useFootprints() {
  const { user } = useAuth()

  // 根据在册身份生成独立抽屉钥匙，若是游客则使用临时柜
  const getHistoryKey = () => user.value?.id ? `ac_history_${user.value.id}` : 'ac_history_guest'
  const getFavoritesKey = () => user.value?.id ? `ac_favorites_${user.value.id}` : 'ac_favorites_guest'

  if (!isInitialized) {
    // 监听身份变化，一旦您换号或是登录，立刻把抽屉里的卷宗换成那人的
    watch(() => user.value?.id, () => {
      history.value = JSON.parse(localStorage.getItem(getHistoryKey()) || '[]')
      favorites.value = JSON.parse(localStorage.getItem(getFavoritesKey()) || '[]')
    }, { immediate: true })

    // 数据被改动时，回写至当前的专属柜子
    watch(history, (val) => {
      localStorage.setItem(getHistoryKey(), JSON.stringify(val))
    }, { deep: true })

    watch(favorites, (val) => {
      localStorage.setItem(getFavoritesKey(), JSON.stringify(val))
    }, { deep: true })
    
    isInitialized = true
  }
  
  // 记录足迹 (type: 'city' | 'experience')
  const addHistory = (item) => {
    // 去重，如果曾经来过，把之前的脚印抹掉，重新排在最前面
    history.value = history.value.filter(h => !(h.id === item.id && h.type === item.type))
    history.value.unshift({ ...item, timestamp: Date.now() })
    // 卷轴最多保留 50 步足迹
    if (history.value.length > 50) history.value.pop()
  }

  // 检查这卷书库里是否有此物
  const isFavorite = (id, type) => {
    return favorites.value.some(f => f.id === id && f.type === type)
  }

  // 翻转收藏状态 (盖印 / 撤印)
  const toggleFavorite = (item) => {
    if (isFavorite(item.id, item.type)) {
      // 撤去印记
      favorites.value = favorites.value.filter(f => !(f.id === item.id && f.type === item.type))
    } else {
      // 盖上朱砂大印
      favorites.value.unshift({ ...item, timestamp: Date.now() })
    }
  }

  return {
    history,
    favorites,
    addHistory,
    isFavorite,
    toggleFavorite
  }
}
